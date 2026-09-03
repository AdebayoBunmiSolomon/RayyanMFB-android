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
  AccountOfficeResponse,
  ChangePassword_,
  GetProfileResponse,
  ProfilePicture,
  SavePhotoResponse,
  SecretQuestion,
  TnxPIN,
  UserSecutiyQuestionResponse,
} from '../types/settings.types';

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
    // try to get a new token
    const payload = {
      isLoggedIn: false,
      showSplash: false,
      message: 'Invalid or expired token. Please login again.',
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

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SecurityQuestions', 'AccountOfficer', 'ProfilePicture'],
  endpoints: builder => ({
    changeUserPassword: builder.mutation<{}, ChangePassword_>({
      query: data => ({
        url: '/v1/customer/retail/credentials',
        method: 'POST',
        body: data,
      }),
    }),

    getUserSecurityQuestions: builder.query<UserSecutiyQuestionResponse, void>({
      query: () => ({
        url: `/v1/customer/retail/security-questions`,
      }),
      providesTags: ['SecurityQuestions'],
    }),

    maintainSecretQuestions: builder.mutation<{}, SecretQuestion>({
      query: data => ({
        url: `/v1/customer/retail/security-questions?transactionPin=${data.transactionPin}`,
        method: 'POST',
        body: data.questionsAndAnswers,
      }),
    }),

    maintainTransactionPIN: builder.mutation<{}, TnxPIN>({
      query: data => ({
        url: `/v1/customer/retail/transaction-pin?command=${data.command}`,
        method: 'POST',
        body: data.request,
      }),
    }),

    getAccountOfficer: builder.query<AccountOfficeResponse[], void>({
      query: () => ({
        url: `/v1/customer/retail/account-officers`,
      }),
      providesTags: ['AccountOfficer'],
    }),

    saveProfilePicture: builder.mutation<SavePhotoResponse, ProfilePicture>({
      query: data => ({
        url: '/v1/customer/retail/profile-image',
        method: 'POST',
        body: data,
      }),
    }),

    getProfileInfo: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: `/v1/customer/retail/info`,
      }),
      providesTags: ['ProfilePicture'],
    }),
  }),
});

export const {
  useChangeUserPasswordMutation,
  useLazyGetUserSecurityQuestionsQuery,
  useMaintainSecretQuestionsMutation,
  useMaintainTransactionPINMutation,
  useLazyGetAccountOfficerQuery,
  useSaveProfilePictureMutation,
  useLazyGetProfileInfoQuery,
} = settingsApi;
