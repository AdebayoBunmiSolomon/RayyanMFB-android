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
  BankNameEnqResponse,
  DebitAccounts,
  InterBank,
  InterBankFeeParams,
  InterBankFeeResponse,
  InterBankNameEnqParams,
  InterBankResponse,
  IntraBank,
  IntraBankNameEnqParams,
  IntraBankResponse,
  TransferLimitParams,
  TransferLimitResponse,
  TransferReceiptParams,
  TransferReceiptResponse,
  UsedLeftResponse,
} from '../types/transfer.types';
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

export const transferApi = createApi({
  reducerPath: 'transferApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DebitAccounts'],
  endpoints: builder => ({
    interBankTranfer: builder.mutation<InterBankResponse, InterBank>({
      query: data => ({ url: '/v1/interbank/nip', method: 'POST', body: data }),
    }),

    intraBankTranfer: builder.mutation<IntraBankResponse, IntraBank>({
      query: data => ({
        url: '/v1/localtransfer/process',
        method: 'POST',
        body: data,
      }),
    }),

    getDebitAccounts: builder.query<DebitAccounts, void>({
      query: () => ({
        url: '/v1/localtransfer/nairaaccount',
      }),
      providesTags: ['DebitAccounts'],
    }),

    interBankNameEnquiry: builder.query<
      BankNameEnqResponse,
      InterBankNameEnqParams
    >({
      query: data => ({
        url: `/v1/transfer/${data.accountNo}/${data.bankCode}/interbank/nameenquiry`,
      }),
    }),

    intraBankNameEnquiry: builder.mutation<
      BankNameEnqResponse,
      IntraBankNameEnqParams
    >({
      query: data => ({
        url: `/v1/transfer/${data.accountNo}/intrabank/nameenquiry`,
        method: 'POST',
        body: {},
      }),
    }),

    getInterBankFee: builder.query<InterBankFeeResponse, InterBankFeeParams>({
      query: data => ({
        url: `/v1/interbank/${data.amount}/fee`,
      }),
    }),

    getTransferReceipt: builder.query<
      TransferReceiptResponse,
      TransferReceiptParams
    >({
      query: data => ({
        url: `/v1/transfer/${data.transferId}/receipt`,
      }),
    }),

    downloadTransferReceipt: builder.query<
      TransferReceiptResponse,
      TransferReceiptParams
    >({
      query: data => ({
        url: `/v1/transfer/${data.transferId}/download-receipt`,
      }),
    }),

    getIntraBankTransferLimit: builder.query<
      TransferLimitResponse,
      TransferLimitParams
    >({
      query: data => ({
        url: `/v1/transfer/limit/${data.acctNumber}/${data.channel}`,
      }),
    }),

    getInterBankTransferLimit: builder.query<
      TransferLimitResponse,
      TransferLimitParams
    >({
      query: data => ({
        url: `/v1/transfer/limit/${data.acctNumber}/${data.channel}`,
      }),
    }),

    getIntraBankUsedLeft: builder.query<UsedLeftResponse, string>({
      query: accountNumber => ({
        url: `/v1/transfer/limit/${accountNumber}/INTRABANK`,
      }),
    }),

    getInterBankUsedLeft: builder.query<UsedLeftResponse, string>({
      query: accountNumber => ({
        url: `/v1/transfer/limit/${accountNumber}/NIP`,
      }),
    }),
  }),
});

export const {
  useInterBankTranferMutation,
  useLazyGetDebitAccountsQuery,
  useIntraBankNameEnquiryMutation,
  useLazyInterBankNameEnquiryQuery,
  useLazyGetInterBankFeeQuery,
  useIntraBankTranferMutation,
  useLazyGetTransferReceiptQuery,
  useLazyGetInterBankTransferLimitQuery,
  useLazyGetIntraBankTransferLimitQuery,
  useLazyGetIntraBankUsedLeftQuery,
  useLazyGetInterBankUsedLeftQuery,
  useLazyDownloadTransferReceiptQuery,
} = transferApi;
