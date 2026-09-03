import { useState, useCallback } from 'react';
import { useAppToast } from './useAppToast';

export interface FormError {
  field: string;
  message: string;
  type: 'validation' | 'server' | 'network' | 'unknown';
}

export interface FormErrorHandlerOptions {
  showToast?: boolean;
  toastPosition?: 'top' | 'bottom';
  clearOnSuccess?: boolean;
}

export const useFormErrorHandler = (options: FormErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    toastPosition = 'top',
    clearOnSuccess = true,
  } = options;

  const { showError, showSuccess } = useAppToast();
  const [errors, setErrors] = useState<FormError[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const addError = useCallback(
    (error: FormError) => {
      setErrors(prev => [...prev, error]);

      // Update field-specific errors
      setFieldErrors(prev => ({
        ...prev,
        [error.field]: error.message,
      }));

      // Show toast if enabled
      if (showToast) {
        showError(`${error.field} Error`, error.message);
      }
    },
    [showToast, showError],
  );

  const addErrors = useCallback(
    (newErrors: FormError[]) => {
      setErrors(prev => [...prev, ...newErrors]);

      // Update field-specific errors
      const newFieldErrors: Record<string, string> = {};
      newErrors.forEach(error => {
        newFieldErrors[error.field] = error.message;
      });

      setFieldErrors(prev => ({
        ...prev,
        ...newFieldErrors,
      }));

      // Show toast for first error if enabled
      if (showToast && newErrors.length > 0) {
        const firstError = newErrors[0];
        showError(`${firstError.field} Error`, firstError.message);
      }
    },
    [showToast, showError],
  );

  const setFieldError = useCallback(
    (
      field: string,
      message: string,
      type: FormError['type'] = 'validation',
    ) => {
      const error: FormError = { field, message, type };
      addError(error);
    },
    [addError],
  );

  const clearError = useCallback((field: string) => {
    setErrors(prev => prev.filter(error => error.field !== field));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback((fields?: string[]) => {
    if (fields) {
      setErrors(prev => prev.filter(error => !fields.includes(error.field)));
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        fields.forEach(field => delete newErrors[field]);
        return newErrors;
      });
    } else {
      setErrors([]);
      setFieldErrors({});
    }
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setFieldErrors({});
  }, []);

  const hasError = useCallback(
    (field: string) => {
      return !!fieldErrors[field];
    },
    [fieldErrors],
  );

  const getFieldError = useCallback(
    (field: string) => {
      return fieldErrors[field] || '';
    },
    [fieldErrors],
  );

  const hasAnyErrors = useCallback(() => {
    return errors.length > 0;
  }, [errors]);

  const getErrorsByType = useCallback(
    (type: FormError['type']) => {
      return errors.filter(error => error.type === type);
    },
    [errors],
  );

  const handleValidationError = useCallback(
    (validationErrors: Record<string, string>) => {
      const formErrors: FormError[] = Object.entries(validationErrors).map(
        ([field, message]) => ({
          field,
          message,
          type: 'validation' as const,
        }),
      );

      addErrors(formErrors);
    },
    [addErrors],
  );

  const handleServerError = useCallback(
    (serverErrors: Record<string, string>) => {
      const formErrors: FormError[] = Object.entries(serverErrors).map(
        ([field, message]) => ({
          field,
          message,
          type: 'server' as const,
        }),
      );

      addErrors(formErrors);
    },
    [addErrors],
  );

  const handleSuccess = useCallback(
    (message?: string) => {
      if (clearOnSuccess) {
        clearAllErrors();
      }

      if (message && showToast) {
        showSuccess('Success', message);
      }
    },
    [clearOnSuccess, clearAllErrors, message, showToast, showSuccess],
  );

  const validateRequired = useCallback(
    (data: Record<string, any>, requiredFields: string[]) => {
      const validationErrors: Record<string, string> = {};

      requiredFields.forEach(field => {
        const value = data[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          validationErrors[field] = `${field} is required`;
        }
      });

      if (Object.keys(validationErrors).length > 0) {
        handleValidationError(validationErrors);
        return false;
      }

      return true;
    },
    [handleValidationError],
  );

  const validateEmail = useCallback(
    (email: string, field: string = 'email') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError(field, 'Please enter a valid email address');
        return false;
      }
      return true;
    },
    [setFieldError],
  );

  const validatePhone = useCallback(
    (phone: string, field: string = 'phone') => {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
        setFieldError(field, 'Please enter a valid phone number');
        return false;
      }
      return true;
    },
    [setFieldError],
  );

  const validatePassword = useCallback(
    (password: string, field: string = 'password') => {
      if (password.length < 8) {
        setFieldError(field, 'Password must be at least 8 characters long');
        return false;
      }

      if (!/(?=.*[a-z])/.test(password)) {
        setFieldError(
          field,
          'Password must contain at least one lowercase letter',
        );
        return false;
      }

      if (!/(?=.*[A-Z])/.test(password)) {
        setFieldError(
          field,
          'Password must contain at least one uppercase letter',
        );
        return false;
      }

      if (!/(?=.*\d)/.test(password)) {
        setFieldError(field, 'Password must contain at least one number');
        return false;
      }

      return true;
    },
    [setFieldError],
  );

  return {
    // State
    errors,
    fieldErrors,

    // Error management
    addError,
    addErrors,
    setFieldError,
    clearError,
    clearErrors,
    clearAllErrors,

    // Error checking
    hasError,
    getFieldError,
    hasAnyErrors,
    getErrorsByType,

    // Specialized handlers
    handleValidationError,
    handleServerError,
    handleSuccess,

    // Validation helpers
    validateRequired,
    validateEmail,
    validatePhone,
    validatePassword,
  };
};
