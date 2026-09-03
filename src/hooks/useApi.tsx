/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import apiOptions from '../util/apiOptions';
import { useAppSelector } from './hook';
import { ErrorResponse } from '../types/public.types';
import { useAuthInterceptor } from './useAuthInterceptor';
import { useErrorHandler, ErrorDetails } from './useErrorHandler';
import { IS_CORPORATE } from '../../config';

interface UseApiOptions<TResponse = any> {
  endpoint: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: AxiosError, errorDetails: ErrorDetails) => void;
  retryCount?: number;
  showErrorToast?: boolean;
}

export type ApiResponse<T = any> = {
  status?: string;
  message?: string;
  data: T;
};

export const useApi = <TResponse = any,>({
  endpoint,
  onSuccess,
  onError,
  retryCount = 3,
  showErrorToast = false,
}: UseApiOptions<TResponse>) => {
  const { token } = useAppSelector(state => state.auth.data);

  const { handleError, handleWithRetry, resetRetryCount } = useErrorHandler({
    showToast: showErrorToast,
    logError: true,
    retryCount,
  });

  const apiConfig =
    apiOptions[IS_CORPORATE ? 'corp' : 'retail']?.[
      endpoint as keyof typeof apiOptions
    ];
  const { method, url } = apiConfig || {};

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  useAuthInterceptor(token);

  const requestInit = useCallback(
    async (
      requestData?: any,
      reqUrl?: string,
    ): Promise<AxiosResponse<TResponse> | undefined> => {
      if (!url || !method) {
        const configError = new Error('API method or URL is undefined.');
        console.error('API configuration error:', configError);
        return;
      }

      console.log('config-1', reqUrl);

      setLoading(true);
      setError(null);
      setErrorDetails(null);
      resetRetryCount();

      const config: AxiosRequestConfig = {
        url: reqUrl ?? url,
        method,
        data: requestData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      };

      // console.log('config-1', config);

      try {
        const response = await axiosInstance.request<TResponse>(config);
        console.log('response from api', response);
        console.log('api config', config);

        // Check for error data in successful responses (e.g., invalid token with 200 status)
        if (response.data && typeof response.data === 'string') {
          const responseString = response.data;
          if (
            responseString.includes("code='99'") &&
            responseString.includes('error=true') &&
            (responseString.includes('Invalid token') ||
              responseString.includes('expired token'))
          ) {
            // Create a mock error to trigger the error handler
            const mockError = {
              isAxiosError: true,
              response: {
                status: 200,
                data: responseString,
              },
              message: 'Invalid token error in response',
            } as any;

            const details = handleError(mockError, `API:${endpoint}`);
            if (details) {
              setErrorDetails(details);
              onError?.(mockError, details);
            }
            return undefined;
          }
        }

        setData(response.data);
        onSuccess?.(response.data);
        return response;
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        console.log('axios error', axiosErr);
        setError(axiosErr);

        // Use enhanced error handling
        const details = handleError(axiosErr, `API:${endpoint}`);
        if (details) {
          setErrorDetails(details);
          // Call custom error handler with both error and categorized details
          onError?.(axiosErr, details);
        }

        // Don't throw here, let the caller handle the error
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      url,
      method,
      onSuccess,
      onError,
      endpoint,
      handleError,
      resetRetryCount,
    ],
  );

  const requestWithRetry = useCallback(
    async (
      requestData?: any,
      reqUrl?: string,
    ): Promise<AxiosResponse<TResponse> | undefined> => {
      if (!url || !method) {
        const configError = new Error('API method or URL is undefined.');
        console.error('API configuration error:', configError);
        return;
      }

      setLoading(true);
      setError(null);
      setErrorDetails(null);
      resetRetryCount();

      const config: AxiosRequestConfig = {
        url: reqUrl ?? url,
        method,
        data: requestData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      };

      try {
        const response = await handleWithRetry(
          () => axiosInstance.request<TResponse>(config),
          `API:${endpoint}`,
        );

        // Check for error data in successful responses (e.g., invalid token with 200 status)
        if (response.data && typeof response.data === 'string') {
          const responseString = response.data;
          if (
            responseString.includes("code='99'") &&
            responseString.includes('error=true') &&
            (responseString.includes('Invalid token') ||
              responseString.includes('expired token'))
          ) {
            // Create a mock error to trigger the error handler
            const mockError = {
              isAxiosError: true,
              response: {
                status: 200,
                data: responseString,
              },
              message: 'Invalid token error in response',
            } as any;

            const details = handleError(mockError, `API:${endpoint}`);
            if (details) {
              setErrorDetails(details);
              onError?.(mockError, details);
            }
            return undefined;
          }
        }

        setData(response.data);
        onSuccess?.(response.data);
        return response;
      } catch (err) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        setError(axiosErr);

        const details = handleError(axiosErr, `API:${endpoint}`);
        if (details) {
          setErrorDetails(details);
          onError?.(axiosErr, details);
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      url,
      method,
      onSuccess,
      onError,
      endpoint,
      handleWithRetry,
      handleError,
      resetRetryCount,
    ],
  );

  const clearError = useCallback(() => {
    setError(null);
    setErrorDetails(null);
    resetRetryCount();
  }, []);

  return {
    data,
    requestInit,
    requestWithRetry,
    error,
    errorDetails,
    loading,
    clearError,
  };
};
