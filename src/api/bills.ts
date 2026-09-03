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
  AddBillBeneficiary_,
  AddBillBeneficiaryResponse,
  AirtimeCodes,
  BillBeneficiaryByBCParams,
  BillBeneficiaryByBCResponse,
  BillerInformationResponse,
  BillItems,
  BillPaymentDetails,
  BillsHistoryParams,
  BillsHistoryResponse,
  BillsPayment,
  BillsPaymentResponse,
  Categories,
  CategoryBills,
  DataSubscriptionCategories,
  DeleteBillBeneficiary_,
  DeleteBillBeneficiaryResponse,
  GetAllBillBeneficiaryResponse,
  GetBillBeneficiaryResponse,
  PaymentItemsResponse,
  UpdateBillBeneficiary_,
  UpdateBillBeneficiaryResponse,
} from '../types/bills-payments.types';

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

export const billsApi = createApi({
  reducerPath: 'billsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Categories',
    'Billers',
    'Products',
    'PaymentCodes',
    'DataSubscription',
    'PaymentItems',
    'BillerDetails',
    'SingleBillBeneficiary',
    'AllBillerBeneficiaries',
    'BillerBeneficiariesByBC',
    'PaginatedHistory',
    'BillHistory',
  ],
  endpoints: builder => ({
    makePayment: builder.mutation<BillsPaymentResponse, BillsPayment>({
      query: data => ({
        url: '/v1/bills-payment',
        method: 'POST',
        body: data,
      }),
    }),

    listCategories: builder.query<Categories[], void>({
      query: () => ({
        url: '/v1/bills-payment/categories',
      }),
      providesTags: ['Categories'],
    }),

    listBillersByCategoryName: builder.query<CategoryBills[], string>({
      query: categoryName => ({
        url: `/v1/bills-payment/categories/${categoryName}/bills`,
      }),
      providesTags: ['Billers'],
    }),

    listProductsByBillerID: builder.query<BillItems[], string>({
      query: billerId => ({
        url: `/v1/bills-payment/bills/${billerId}/payment-items`,
      }),
      providesTags: ['Products'],
    }),

    listBillerDetailsByBillerID: builder.query<
      BillerInformationResponse,
      string
    >({
      query: billerId => ({
        url: `/v1/bills-payment/bills/${billerId}`,
      }),
      providesTags: ['BillerDetails'],
    }),

    listAirtimePaymentCodes: builder.query<AirtimeCodes[], void>({
      query: () => ({
        url: `/v1/bills-payment/airtime-payment-codes`,
      }),
      providesTags: ['PaymentCodes'],
    }),

    listDataSubscriptionCategories: builder.query<
      DataSubscriptionCategories[],
      void
    >({
      query: () => ({
        url: `/v1/bills-payment/data-subscription-categories`,
      }),
      providesTags: ['DataSubscription'],
    }),

    listPaymentItemWithCode: builder.query<PaymentItemsResponse, string>({
      query: paymentCode => ({
        url: `/v1/bills-payment/payment-items/${paymentCode}`,
      }),
      providesTags: ['PaymentItems'],
    }),

    addBillerBeneficiary: builder.mutation<
      AddBillBeneficiaryResponse,
      AddBillBeneficiary_
    >({
      query: data => ({
        url: '/v1/biller-beneficiaries',
        method: 'POST',
        body: data,
      }),
    }),

    updateBillerBeneficiary: builder.mutation<
      UpdateBillBeneficiaryResponse,
      UpdateBillBeneficiary_
    >({
      query: data => ({
        url: `/v1/biller-beneficiaries/${data.id}`,
        method: 'PUT',
        body: data.body,
      }),
    }),

    deleteBillerBeneficiary: builder.mutation<
      DeleteBillBeneficiaryResponse,
      DeleteBillBeneficiary_
    >({
      query: data => ({
        url: `/v1/biller-beneficiaries/${data.id}`,
        method: 'DELETE',
        body: data.body,
      }),
    }),

    getSingleBillerBeneficiaryByID: builder.query<
      GetBillBeneficiaryResponse,
      string
    >({
      query: id => ({
        url: `/v1/biller-beneficiaries/${id}`,
      }),
      providesTags: ['SingleBillBeneficiary'],
    }),

    getAllBillerBeneficiaries: builder.query<
      GetAllBillBeneficiaryResponse,
      void
    >({
      query: () => ({
        url: `/v1/biller-beneficiaries`,
      }),
      providesTags: ['AllBillerBeneficiaries'],
    }),

    getBillerBeneficiariesByBC: builder.query<
      BillBeneficiaryByBCResponse,
      BillBeneficiaryByBCParams
    >({
      query: ({ biller, category }) => ({
        url: `/v1/biller-beneficiaries/find/category-and-biller?biller=${biller}&category=${category}`,
      }),
      providesTags: ['BillerBeneficiariesByBC'],
    }),

    getPaginatedBillsHistory: builder.query<
      BillsHistoryResponse,
      BillsHistoryParams
    >({
      query: ({ pageNumber, pageSize }) => ({
        url: `/v1/bills-payment?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      providesTags: ['PaginatedHistory'],
    }),

    getSingleBillsHistory: builder.query<BillPaymentDetails, string>({
      query: id => ({
        url: `/v1/bills-payment/${id}`,
      }),
      providesTags: ['BillHistory'],
    }),
  }),
});

export const {
  useMakePaymentMutation,
  useLazyListCategoriesQuery,
  useLazyListBillersByCategoryNameQuery,
  useLazyListProductsByBillerIDQuery,
  useLazyListAirtimePaymentCodesQuery,
  useLazyListDataSubscriptionCategoriesQuery,
  useLazyListBillerDetailsByBillerIDQuery,
  useLazyListPaymentItemWithCodeQuery,
  useAddBillerBeneficiaryMutation,
  useUpdateBillerBeneficiaryMutation,
  useDeleteBillerBeneficiaryMutation,
  useLazyGetSingleBillerBeneficiaryByIDQuery,
  useLazyGetAllBillerBeneficiariesQuery,
  useLazyGetBillerBeneficiariesByBCQuery,
  useLazyGetPaginatedBillsHistoryQuery,
  useLazyGetSingleBillsHistoryQuery,
} = billsApi;
