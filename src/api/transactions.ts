import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logOutUser } from '../slices/authSlice';
import { RootState } from '../stores/store';
import { BASE_URL } from 'react-native-dotenv';
import {
  DownloadStatementParams,
  DownloadStatementResponse,
  EmailStatementParams,
  EmailStatementResponse,
  GenerateParams,
  GenerateResponse,
  LastTenTransactions,
  SearchParams,
  SearchResponse,
  SingleTransParams,
  UserAccounts,
} from '../types/transactions.types';
import { BankTransferResponse } from '../types/transfer.types';
import { NEW_API_KEY } from './axiosInstance';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.data.token;

    if (token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('X-MOBILE-API-KEY', NEW_API_KEY);
    return headers;
  },
  credentials: 'include', // This allows server to set cookies
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    (result.error && result.error.status === 401) ||
    result.error?.status === 'PARSING_ERROR'
  ) {
    // try to get a new token
    const payload = {
      isLoggedIn: false,
      showSplash: false,
      message: '',
      token: '',
      data: {
        firstName: '',
        lastName: '',
        username: '',
        phoneNumber: '',
        email: '',
        token: '',
      },
    };
    api.dispatch(logOutUser(payload));
  }
  return result;
};

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'AllAccounts',
    'TenTransactions',
    'SingleTransaction',
    'DownloadStatement',
  ],
  endpoints: builder => ({
    getAllAccounts: builder.query<UserAccounts, void>({
      query: () => ({
        url: '/v1/account/all',
      }),
      providesTags: ['AllAccounts'],
    }),
    getTenTransactions: builder.query<LastTenTransactions, number>({
      query: id => ({
        url: `/v1/account/last10tran/${id}`,
      }),
      providesTags: ['TenTransactions'],
    }),

    getTransactionsStatementPDF: builder.query<
      DownloadStatementResponse,
      DownloadStatementParams
    >({
      query: ({ toDate, fromDate, tranType, acctNumber, format }) => ({
        url: `/v1/account/statements/data?acctNumber=${acctNumber}&fromDate=${fromDate}&toDate=${toDate}&tranType=${tranType}&format=${format}`,
      }),
    }),

    searchTransactions: builder.mutation<SearchResponse, SearchParams>({
      query: data => ({
        url: '/v1/account/accountstatement',
        method: 'POST',
        body: data,
      }),
    }),

    generateStatement: builder.query<GenerateResponse, GenerateParams>({
      query: data => ({
        url: `/v1/account/statements/data?acctNumber=${data.acctNum}&fromDate=${data.fromDate}&toDate=${data.toDate}&tranType=${data.tranType}&format=${data.format}`,
      }),
      providesTags: ['DownloadStatement'],
    }),

    sendStatementViaEmail: builder.mutation<
      EmailStatementResponse,
      EmailStatementParams
    >({
      query: data => ({
        url: '/v1/account/accountstatement',
        method: 'POST',
        body: data,
      }),
    }),

    getSingleTransactionDetails: builder.query<
      BankTransferResponse,
      SingleTransParams
    >({
      query: ({ tranId, amount, narration, uniqueIdentifier }) => ({
        // url: `/v1/transfer/${tranId}`,
        // tranDate,
        // &transactionDate=${tranDate}
        url: `/v1/transfer/${tranId}?narration=${narration}&amount=${amount}&uniqueIdentifier=${uniqueIdentifier}`,
      }),
      providesTags: ['SingleTransaction'],
    }),
  }),
});

export const {
  useLazyGetAllAccountsQuery,
  useLazyGetTenTransactionsQuery,
  useLazyGetTransactionsStatementPDFQuery,
  useSearchTransactionsMutation,
  useLazyGenerateStatementQuery,
  useLazyGetSingleTransactionDetailsQuery,
  useSendStatementViaEmailMutation,
} = transactionsApi;
