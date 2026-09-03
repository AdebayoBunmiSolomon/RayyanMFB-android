import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios, { AxiosError } from 'axios';
import { RootState } from '../stores/store';
import { BASE_URL } from '@env';
import {
  Banks,
  BeneficiariesResponse,
  DebitAccounts,
  TransferResponse,
  UsedLeftResponse,
} from '../types/transfer.types';
import { logOutUser } from './authSlice';

const initialState: TransferResponse = {
  loading: false,
  accounts: [],
  banks: [],
  inter: {
    data: [],
  },
  intra: {
    data: [],
  },
  interUsedLeft: {
    dailyRemaining: 0,
    singleTransactionCap: 0,
  },
  intraUsedLeft: {
    dailyRemaining: 0,
    singleTransactionCap: 0,
  },
};

export const listBanks = createAsyncThunk(
  'transfer/listBanks',
  async (_, { rejectWithValue, getState, dispatch }) => {
    const token = (getState() as RootState).auth.data.token;

    const { data } = (getState() as RootState).auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await Axios.get<Banks[]>(
        `${BASE_URL}/v1/localtransfer/localfinancialinst`,
        config,
      );
      return data;
    } catch (error) {
      const err = error as AxiosError;
      // return rejectWithValue(err?.response?.data);
      if (
        (err.response && err.response.status === 401) ||
        err.response?.status === 200
      ) {
        // Handle token expiration or 401 status code here
        const payload = {
          isLoggedIn: false,
          showSplash: false,
          message: '',
          token: '',
          data: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            phoneNumber: '',
            username: '',
            email: '',
            token: '',
          },
        };
        dispatch(logOutUser(payload));
        return rejectWithValue('Unauthorized'); // You can customize the error message
      }

      throw error;
    }
  },
);

export const listIntraBankBeneficiaries = createAsyncThunk(
  'transfer/listIntraBankBeneficiaries',
  async (_, { rejectWithValue, getState, dispatch }) => {
    const token = (getState() as RootState).auth.data.token;
    const { data } = (getState() as RootState).auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await Axios.get<BeneficiariesResponse>(
        `${BASE_URL}/v1/localtransfer/beneficiary`,
        config,
      );
      return data;
    } catch (error) {
      const err = error as AxiosError;
      // return rejectWithValue(err?.response?.data);
      if (
        (err.response && err.response.status === 401) ||
        err.response?.status === 200
      ) {
        // Handle token expiration or 401 status code here
        const payload = {
          isLoggedIn: false,
          showSplash: false,
          message: '',
          token: '',
          data: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            username: '',
            phoneNumber: '',
            email: '',
            token: '',
          },
        };
        dispatch(logOutUser(payload));
        return rejectWithValue('Unauthorized'); // You can customize the error message
      }

      throw error;
    }
  },
);

export const listInterBankBeneficiaries = createAsyncThunk(
  'transfer/listInterBankBeneficiaries',
  async (_, { rejectWithValue, getState, dispatch }) => {
    const token = (getState() as RootState).auth.data.token;
    const { data } = (getState() as RootState).auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await Axios.get<BeneficiariesResponse>(
        `${BASE_URL}/v1/interbank/beneficiary`,
        config,
      );
      return data;
    } catch (error) {
      const err = error as AxiosError;
      // return rejectWithValue(err?.response?.data);
      if (
        (err.response && err.response.status === 401) ||
        err.response?.status === 200
      ) {
        // Handle token expiration or 401 status code here
        const payload = {
          isLoggedIn: false,
          showSplash: false,
          message: '',
          token: '',
          data: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            username: '',
            phoneNumber: '',
            email: '',
            token: '',
          },
        };
        dispatch(logOutUser(payload));
        return rejectWithValue('Unauthorized'); // You can customize the error message
      }

      throw error;
    }
  },
);

export const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    setDebitAccounts: (state, { payload }: PayloadAction<DebitAccounts>) => {
      state.accounts = payload.data;
    },

    setIntraUsedLeft: (state, { payload }: PayloadAction<UsedLeftResponse>) => {
      state.intraUsedLeft = payload;
    },

    setInterUsedLeft: (state, { payload }: PayloadAction<UsedLeftResponse>) => {
      state.interUsedLeft = payload;
    },
  },
  extraReducers(builder) {
    builder

      .addCase(listBanks.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(
        listBanks.fulfilled,
        (state, { payload }: PayloadAction<Banks[]>) => {
          state.banks = payload;
          state.loading = false;
        },
      )
      .addCase(listBanks.rejected, (state, { payload }) => {
        state.loading = false;
      })

      .addCase(listInterBankBeneficiaries.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(
        listInterBankBeneficiaries.fulfilled,
        (state, { payload }: PayloadAction<BeneficiariesResponse>) => {
          state.inter = payload;
          state.loading = false;
        },
      )
      .addCase(listInterBankBeneficiaries.rejected, (state, { payload }) => {
        state.loading = false;
      })

      .addCase(listIntraBankBeneficiaries.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(
        listIntraBankBeneficiaries.fulfilled,
        (state, { payload }: PayloadAction<BeneficiariesResponse>) => {
          state.intra = payload;
          state.loading = false;
        },
      )
      .addCase(listIntraBankBeneficiaries.rejected, (state, { payload }) => {
        state.loading = false;
      });
  },
});

export const { setDebitAccounts, setInterUsedLeft, setIntraUsedLeft } =
  transferSlice.actions;

export default transferSlice.reducer;
