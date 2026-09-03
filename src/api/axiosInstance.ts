// import axios from 'axios';
// import DeviceInfo from 'react-native-device-info';
// import { Platform } from 'react-native';

// const API_KEY = 'ey6556433434gfgddh7uuytqyomuxx9883789bchnzqjeoryo';

// // Check if running in development mode
// const isDevelopment = __DEV__;

// const axiosInstance = axios.create({
//   baseURL: 'https://ibank.rayyanbank.com.ng/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-MOBILE-API-KEY': 'ey765443409gffrgfhj8sdfrzabjmko23570b099876jhkjoip',
//     'X-MOBILE-DEVICE-NAME': await DeviceInfo.getDeviceName(),
//     'X-MOBILE-DEVICE-VERSION': DeviceInfo.getDeviceId(),
//   },
//   timeout: 15000,
//   // SSL configuration for React Native
//   validateStatus: status => status >= 200 && status < 300,
//   // SSL bypass configuration for expired certificates (like Postman)
//   httpsAgent:
//     Platform.OS === 'android'
//       ? {
//           rejectUnauthorized: false, // Bypass certificate validation (like Postman)
//           checkServerIdentity: () => undefined, // Skip hostname verification
//           secureProtocol: 'TLSv1_2_method', // Use TLS 1.2
//         }
//       : undefined,
// });

// // Add request interceptor for SSL debugging and Postman-like behavior
// if (isDevelopment) {
//   axiosInstance.interceptors.request.use(
//     config => {
//       // Add Postman-like headers
//       config.headers = {
//         ...config.headers,
//         'User-Agent': 'ReactNative/1.0',
//         Accept: 'application/json, text/plain, */*',
//       };
//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     },
//   );

//   axiosInstance.interceptors.response.use(
//     response => {
//       return response;
//     },
//     error => {
//       // If it's still a network error, try to provide more helpful information
//       if (error.message === 'Network Error') {
//       }

//       return Promise.reject(error);
//     },
//   );
// }

// // Setup function to set custom headers dynamically
// export const setupAxiosHeaders = async () => {
//   const deviceName = await DeviceInfo.getDeviceName();
//   const deviceVersion = DeviceInfo.getSystemVersion();

//   axiosInstance.defaults.headers.common['X-MOBILE-API-KEY'] = API_KEY;
//   axiosInstance.defaults.headers.common['X-MOBILE-DEVICE-NAME'] =
//     deviceName || 'Unknown';
//   axiosInstance.defaults.headers.common['X-MOBILE-DEVICE-VERSION'] =
//     deviceVersion || 'Unknown';
// };

// // Optional: Token injection (from AsyncStorage, Redux, etc.)
// export const setAuthToken = (token: string) => {
//   if (token) {
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete axiosInstance.defaults.headers.common['Authorization'];
//   }
// };

// export default axiosInstance;

import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

const API_KEY = 'ey6556433434gfgddh7uuytqyomuxx9883789bchnzqjeoryo';
export const NEW_API_KEY = 'ey765443409gffrgfhj8sdfrzabjmko23570b099876jhkjoip';

// TODO: setupAxiosHeaders() below sets API_KEY, while this instance is
// created with NEW_API_KEY. If setupAxiosHeaders() runs anywhere (boot,
// login, etc.) it will overwrite NEW_API_KEY with the old API_KEY. Confirm
// which one should actually be used going forward.

const isDevelopment = __DEV__;

const axiosInstance = axios.create({
  baseURL: 'https://ibank.rayyanbank.com.ng/api',
  headers: {
    'Content-Type': 'application/json',
    'X-MOBILE-API-KEY': NEW_API_KEY,
  },
  timeout: 15000,
  validateStatus: status => status >= 200 && status < 300,
});

// Device info can only be read async, so it can't live in the static headers
// object above (await inside a plain object literal isn't valid JS outside
// an async function — this is what caused the Metro bundling error).
// Instead we resolve it once, cache it, and attach it to every request here.
let deviceHeadersCache: { name: string; id: string } | null = null;

axiosInstance.interceptors.request.use(async config => {
  if (!deviceHeadersCache) {
    deviceHeadersCache = {
      name: (await DeviceInfo.getDeviceName()) || 'Unknown',
      id: DeviceInfo.getDeviceId() || 'Unknown',
    };
  }

  config.headers['X-MOBILE-DEVICE-NAME'] = deviceHeadersCache.name;
  config.headers['X-MOBILE-DEVICE-VERSION'] = deviceHeadersCache.id;

  return config;
});

// Dev-only: adds Postman-like headers for easier request inspection/debugging.
if (isDevelopment) {
  axiosInstance.interceptors.request.use(
    config => {
      config.headers = {
        ...config.headers,
        'User-Agent': 'ReactNative/1.0',
        Accept: 'application/json, text/plain, */*',
      };
      return config;
    },
    error => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    response => response,
    error => Promise.reject(error),
  );
}

// Setup function to set custom headers dynamically
export const setupAxiosHeaders = async () => {
  const deviceName = await DeviceInfo.getDeviceName();
  const deviceVersion = DeviceInfo.getSystemVersion();

  axiosInstance.defaults.headers.common['X-MOBILE-API-KEY'] = API_KEY;
  axiosInstance.defaults.headers.common['X-MOBILE-DEVICE-NAME'] =
    deviceName || 'Unknown';
  axiosInstance.defaults.headers.common['X-MOBILE-DEVICE-VERSION'] =
    deviceVersion || 'Unknown';
};

// Optional: Token injection (from AsyncStorage, Redux, etc.)
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export default axiosInstance;
