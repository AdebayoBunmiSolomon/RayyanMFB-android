// hooks/useAppToast.ts
import { toast } from 'sonner-native';

export const useAppToast = () => {
  const showSuccess = (msg: string, desc?: string) => {
    toast.success(msg, { description: desc });
  };

  const showError = (msg: string, desc?: string) => {
    toast.error(msg, { description: desc });
  };

  const showInfo = (msg: string, desc?: string) => {
    toast(msg, { description: desc });
  };

  return { showSuccess, showError, showInfo };
};
