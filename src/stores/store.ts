import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../slices/authSlice';
import transferReducer from '../slices/transferSlice';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transferApi } from '../api/transfer';
import { beneficiaryApi } from '../api/beneficiary';
import beneficiaryReducer from '../slices/beneficiarySlice';
import transactionsReducer from '../slices/accountsSlice';
import kycSlice from '../slices/kycSlice';
import appSlice from '../slices/appSlice';
import profileReducer from '../slices/profileSlice';
import inactivityReducer from '../slices/userInactivitySlice';
import themeReducer from '../slices/themeSlice';
import accountReducer from '../slices/accountSlice';
import { settingsApi } from '../api/settings';
import { transactionsApi } from '../api/transactions';
import { billsApi } from '../api/bills';
import kycRequestSlice from '../slices/kycRequestSlice';
import shortcutReducer from '../slices/shortcutSlice';
import bulkTransferReducer from '../slices/bulkSlice';
import standingOrderReducer from '../slices/standingOrderSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  kyc: kycSlice,
  app: appSlice,
  kycRequest: kycRequestSlice,
  transfer: transferReducer,
  beneficiary: beneficiaryReducer,
  accounts: transactionsReducer,
  profile: profileReducer,
  theme: themeReducer,
  userInactivity: inactivityReducer,
  bulkTransfer: bulkTransferReducer,
  account: accountReducer,
  shortcut: shortcutReducer,
  [transferApi.reducerPath]: transferApi.reducer,
  [beneficiaryApi.reducerPath]: beneficiaryApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [transactionsApi.reducerPath]: transactionsApi.reducer,
  [billsApi.reducerPath]: billsApi.reducer,
  standingOrder: standingOrderReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['kyc', 'kycRequest', 'profile', 'standingOrder'], //putting strings it in the blacklist means don't store the string data in the local storage e.g 'auth'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      transferApi.middleware,
      beneficiaryApi.middleware,
      settingsApi.middleware,
      transactionsApi.middleware,
      billsApi.middleware,
    ),
  //   devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
