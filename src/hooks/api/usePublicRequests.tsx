import { ForgotPasswordCorpVerifyPayload } from '../../types/public.types';
import { useApi } from '../useApi';

export const useCorpSecurityQAVerify = (onSuccess?: () => void) => {
  return useApi<ForgotPasswordCorpVerifyPayload, any>({
    endpoint: 'forgotPasswordQAVerify',
    onSuccess,
  });
};
