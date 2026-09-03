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
  AddBeneficiary_,
  BeneficiariesResponse,
  DeleteBeneficiary_,
  DeleteBeneficiaryResponse,
} from '../types/transfer.types';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.data.token;

    if (token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
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

export const beneficiaryApi = createApi({
  reducerPath: 'beneficiaryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AllBeneficiaries'],
  endpoints: builder => ({
    getAllBeneficiaries: builder.query<BeneficiariesResponse, void>({
      query: () => ({
        url: `/v1/beneficiary/retail/local/view/all`,
      }),
      providesTags: ['AllBeneficiaries'],
    }),

    addBeneficiary: builder.mutation<BeneficiariesResponse, AddBeneficiary_>({
      query: data => ({
        url: `/v1/beneficiary/retail/local/add`,
        method: 'POST',
        body: data,
      }),
    }),

    deleteBeneficiary: builder.mutation<
      DeleteBeneficiaryResponse,
      DeleteBeneficiary_
    >({
      query: data => ({
        url: `/v1/beneficiary/retail/local/delete`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyGetAllBeneficiariesQuery,
  useAddBeneficiaryMutation,
  useDeleteBeneficiaryMutation,
} = beneficiaryApi;
