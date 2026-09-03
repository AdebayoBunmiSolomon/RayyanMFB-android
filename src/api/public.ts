import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { resetUser } from '../slices/authSlice';
import { RootState } from '../stores/store';
import {
  BvnCustomerDetails,
  CreateNewAccount,
  CreateNewAccountResponse,
  ForgotPasswordOTPRequest,
  ForgotPasswordOTPVerification,
  ForgotRequestQuestions,
  ForgotRequestQuestionsResponse,
  OtpRequest,
  OtpVerification,
  RegExistAccount,
  RegExistAccountResponse,
  ResetDevice,
  ResetDeviceResponse,
  ResetPassword_,
  ResetPasswordResponse,
  SecQuestionnaire,
  SignInUser,
  SignInUserResponse,
} from '../types/public.types';
import { BASE_URL } from 'react-native-dotenv';

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

  // Check for token errors
  const shouldLogout =
    (result.error && result.error.status === 401) ||
    result.error?.status === 'PARSING_ERROR' ||
    // Check for invalid token in successful response with error data
    (result.data &&
      typeof result.data === 'string' &&
      result.data.includes("code='99'") &&
      result.data.includes('error=true') &&
      (result.data.includes('Invalid token') ||
        result.data.includes('expired token')));

  if (shouldLogout) {
    // try to get a new token or logout user
    api.dispatch(resetUser());
  }
  return result;
};

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'SecurityQuestions',
    'CustomerDetails',
    'PasswordQuestions',
    'TermsConditions',
    'Faq',
  ],
  endpoints: builder => ({
    signinUser: builder.mutation<SignInUserResponse, SignInUser>({
      query: data => ({
        url: '/user/signin',
        method: 'POST',
        body: data,
      }),
    }),

    existingAccountOtpRequest: builder.mutation<{}, OtpRequest>({
      query: data => ({
        url: '/self-registrations/otp-request',
        method: 'POST',
        body: data,
      }),
    }),

    verifyAccountOtpRequest: builder.mutation<{}, OtpVerification>({
      query: data => ({
        url: '/self-registrations/otp-verification',
        method: 'POST',
        body: data,
      }),
    }),

    getSecurityQuestions: builder.query<[SecQuestionnaire[]], void>({
      query: () => ({
        url: '/register/security-questions',
      }),
      providesTags: ['SecurityQuestions'],
    }),

    registerExistingAccount: builder.mutation<
      RegExistAccountResponse,
      RegExistAccount
    >({
      query: data => ({
        url: '/self-registrations',
        method: 'POST',
        body: data,
      }),
    }),

    bvnCustomerDetails: builder.query<BvnCustomerDetails, string>({
      query: bvn => ({
        url: `/register/bvn/${bvn}`,
      }),
      providesTags: ['CustomerDetails'],
    }),

    requestForgotPasswordQuestions: builder.query<
      ForgotRequestQuestionsResponse,
      ForgotRequestQuestions
    >({
      query: ({ username, lastFourDigitsOfBvn, accountNumber }) => ({
        url: `/retrieval/retail/security-questions?accountNumber=${accountNumber}&lastFourDigitsOfBvn=${lastFourDigitsOfBvn}&username=${username}`,
      }),
      providesTags: ['PasswordQuestions'],
    }),

    // resetPassword: builder.mutation<ResetPasswordResponse, ResetPassword>({
    //   query: data => ({
    //     url: '/retrieval/retail/forgotpassword',
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPassword_>({
      query: data => ({
        url: '/retrieval/retail/password',
        method: 'POST',
        body: data,
      }),
    }),

    sendForgotPasswordOtp: builder.mutation<{}, ForgotPasswordOTPRequest>({
      query: data => ({
        url: '/retrieval/retail/send-otp',
        method: 'POST',
        body: data,
      }),
    }),

    verifyForgotPasswordOtp: builder.mutation<
      {},
      ForgotPasswordOTPVerification
    >({
      query: data => ({
        url: '/retrieval/retail/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    resetDevice: builder.mutation<ResetDeviceResponse, ResetDevice>({
      query: data => ({
        url: '/retrieval/retail/device',
        method: 'POST',
        body: data,
      }),
    }),

    createNewAccount: builder.mutation<
      CreateNewAccountResponse,
      CreateNewAccount
    >({
      query: data => ({
        url: '/self-registrations',
        method: 'POST',
        body: data,
      }),
    }),

    getTermsAndConditions: builder.query<{ content: string }, void>({
      query: () => ({
        url: '/self-registrations/terms-and-conditions',
      }),
      providesTags: ['TermsConditions'],
    }),
  }),
});

export const {
  useSigninUserMutation,
  useExistingAccountOtpRequestMutation,
  useVerifyAccountOtpRequestMutation,
  useLazyGetSecurityQuestionsQuery,
  useRegisterExistingAccountMutation,
  useLazyBvnCustomerDetailsQuery,
  useLazyRequestForgotPasswordQuestionsQuery,
  useResetPasswordMutation,
  useSendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useCreateNewAccountMutation,
  useResetDeviceMutation,
  useLazyGetTermsAndConditionsQuery,
} = publicApi;
