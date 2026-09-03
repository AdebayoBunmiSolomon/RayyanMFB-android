import { useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { useAppToast } from './useAppToast';
import { useAppDispatch } from './hook';
import { logOutUser } from '../slices/authSlice';

export interface ErrorDetails {
  message: string;
  code?: string;
  status?: number;
  retryable: boolean;
  category: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  retryCount?: number;
  onRetry?: () => void;
  onError?: (error: ErrorDetails) => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logError = true,
    retryCount = 3,
    onRetry,
    onError,
  } = options;
  const { showError, showInfo } = useAppToast();
  const dispatch = useAppDispatch();
  const retryCountRef = useRef(0);

  const categorizeError = useCallback((error: any): ErrorDetails => {
    // Handle Axios errors
    if (error?.isAxiosError) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      let data = axiosError.response?.data as any;

      // Parse string responses (common with some APIs)
      if (typeof data === 'string') {
        try {
          // Handle cases like "{message='User is temporarily locked due to rate limit breach.', data=null, code='99', error=true}"
          // First, try to parse as JSON
          data = JSON.parse(data);
        } catch (parseError) {
          // If JSON parsing fails, try to extract structured data from string
          // Handle format: "{message='Invalid token passed...', data=null, code='99', error=true}"
          const messageMatch = data.match(/message='([^']+)'/);
          const codeMatch = data.match(/code='([^']+)'/);
          const errorMatch = data.match(/error=(true|false)/);

          if (messageMatch || codeMatch || errorMatch) {
            data = {
              message: messageMatch ? messageMatch[1] : undefined,
              code: codeMatch ? codeMatch[1] : undefined,
              error: errorMatch ? errorMatch[1] === 'true' : undefined,
              data: null,
            };
          } else {
            // Fallback to using the string as message
            data = { message: data };
          }
        }
      }

      // Check for invalid token errors (even with 200 status)
      if (
        status === 200 &&
        data?.code === '99' &&
        data?.error === true &&
        (data?.message?.includes('Invalid token') ||
          data?.message?.includes('expired token'))
      ) {
        return {
          message:
            data.message || 'Invalid or expired token. Please login again.',
          code: 'INVALID_TOKEN_99',
          status,
          retryable: false,
          category: 'auth',
        };
      }

      // Rate limit errors (429)
      if (status === 429) {
        return {
          message:
            data?.message ||
            'Too many requests. Please wait a moment and try again.',
          code: 'RATE_LIMIT_429',
          status,
          retryable: true,
          category: 'server',
        };
      }

      // Authentication errors
      if (status === 401) {
        return {
          message:
            data?.message || 'Authentication failed. Please login again.',
          code: 'AUTH_401',
          status,
          retryable: false,
          category: 'auth',
        };
      }

      // Forbidden errors
      if (status === 403) {
        return {
          message:
            data?.message ||
            "Access denied. You don't have permission for this action.",
          code: 'FORBIDDEN_403',
          status,
          retryable: false,
          category: 'auth',
        };
      }

      // Not found errors
      if (status === 404) {
        return {
          message: data?.message || 'Resource not found.',
          code: 'NOT_FOUND_404',
          status,
          retryable: false,
          category: 'server',
        };
      }

      // Validation errors
      if (status === 422) {
        return {
          message: data?.message || 'Invalid data provided.',
          code: 'VALIDATION_422',
          status,
          retryable: false,
          category: 'validation',
        };
      }

      // Server errors
      if (status && status >= 500) {
        return {
          message: data?.message || 'Server error. Please try again later.',
          code: `SERVER_${status}`,
          status,
          retryable: true,
          category: 'server',
        };
      }

      // Network errors
      if (
        axiosError.code === 'NETWORK_ERROR' ||
        axiosError.message === 'Network Error'
      ) {
        return {
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR',
          status,
          retryable: true,
          category: 'network',
        };
      }

      // Timeout errors
      if (axiosError.code === 'ECONNABORTED') {
        return {
          message: 'Request timeout. Please try again.',
          code: 'TIMEOUT',
          status,
          retryable: true,
          category: 'network',
        };
      }

      // Generic HTTP errors
      return {
        message:
          data?.message || `Request failed with status ${status || 'unknown'}`,
        code: `HTTP_${status || 'UNKNOWN'}`,
        status,
        retryable: status ? status >= 500 : false,
        category: 'server',
      };
    }

    // Handle generic JavaScript errors
    if (error instanceof Error) {
      return {
        message: error.message || 'An unexpected error occurred.',
        code: 'JS_ERROR',
        retryable: false,
        category: 'unknown',
      };
    }

    // Handle unknown errors
    return {
      message: 'An unknown error occurred.',
      code: 'UNKNOWN_ERROR',
      retryable: false,
      category: 'unknown',
    };
  }, []);

  const handleError = useCallback(
    (error: any, context?: string) => {
      const errorDetails = categorizeError(error);

      // Log error if enabled
      if (logError) {
        console.error(`[${context || 'ErrorHandler'}] Error:`, {
          ...errorDetails,
          originalError: error,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle authentication errors
      if (
        errorDetails.category === 'auth' &&
        (errorDetails.status === 401 ||
          errorDetails.code === 'INVALID_TOKEN_99')
      ) {
        dispatch(
          logOutUser({
            isLoggedIn: false,
            showSplash: false,
            message: errorDetails.message,
            data: {
              firstName: '',
              lastName: '',
              username: '',
              phoneNumber: '',
              email: '',
              token: '',
            },
          }),
        );
        return;
      }

      // Show toast if enabled
      if (showToast) {
        const title = errorDetails.code || 'Error';
        showError(title, errorDetails.message);
      }

      // Call custom error handler
      onError?.(errorDetails);

      return errorDetails;
    },
    [categorizeError, logError, showToast, onError, dispatch, showError],
  );

  const handleWithRetry = useCallback(
    async (operation: () => Promise<any>, context?: string) => {
      try {
        return await operation();
      } catch (error) {
        const errorDetails = handleError(error, context);

        // Check if error is retryable and we haven't exceeded retry count
        if (errorDetails?.retryable && retryCountRef.current < retryCount) {
          retryCountRef.current++;

          if (showToast) {
            showInfo(
              `Retrying... (${retryCountRef.current}/${retryCount})`,
              'Please wait while we retry the operation.',
            );
          }

          // Wait before retrying (exponential backoff)
          const delay = Math.min(
            1000 * Math.pow(2, retryCountRef.current - 1),
            10000,
          );
          await new Promise(resolve => setTimeout(resolve, delay));

          // Call custom retry handler if provided
          if (onRetry) {
            onRetry();
          }

          // Retry the operation
          return handleWithRetry(operation, context);
        }

        throw error;
      }
    },
    [handleError, retryCount, showToast, showInfo, onRetry],
  );

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  return {
    handleError,
    handleWithRetry,
    resetRetryCount,
    categorizeError,
  };
};
