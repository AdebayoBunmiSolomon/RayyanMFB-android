import { IS_CORPORATE } from '../../config';

export const nextScreen = {
  forgotPasswordRoute: IS_CORPORATE ? 'ConfirmUserAccount' : 'AcctInfo',
} as const;
