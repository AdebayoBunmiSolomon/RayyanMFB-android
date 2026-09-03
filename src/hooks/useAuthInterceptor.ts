import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useAuthInterceptor = (token?: string) => {
  useEffect(() => {
    if (!token) return;

    const interceptor = axiosInstance.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      error => Promise.reject(error),
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [token]);
};
