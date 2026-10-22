import { ReactNode } from 'react';
import {
  StackProps,
  ButtonProps as TagUIButtonProps,
  InputProps as TagUIInputProps,
  ViewProps,
  XStackProps,
  YStackProps,
} from 'tamagui';
import { FAQTypes } from './public.types';
import { ImageSourcePropType } from 'react-native';
import { AirtimeCodes } from './bills-payments.types';

export type FeatureProps = {
  title: string;
  color?: string;
  icon: ReactNode;
  onPress: () => void;
  last?: boolean;
} & YStackProps;

export type LoginTypes = {
  userName: string;
  passWord: string;
  deviceId: string;
};

export type ButtonProps = {
  loading?: boolean;
} & TagUIButtonProps;

export type InputProps = {
  label?: string;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  error?: any;
  helperText?: boolean | string | Element;
  provider?: string;
  selectProvider?: (arg0: number) => void;
  airtimeList?: AirtimeCodes[];
  showRules?: boolean;
  editable?: boolean;
} & TagUIInputProps;

export type HeadingAuthProps = {
  title: string;
  subtitle: string;
  user?: UserTypes;
  swap?: boolean;
  small?: boolean;
} & StackProps;

export type UserTypes = {
  email: string;
  firstName: string;
  lastName: string | null;
  phoneNumber: string;
  token: string;
  username: string;
};

export type TransferTypesProps = {
  setSelected: (arg0: number) => void;
  selected: number;
} & ViewProps;

export interface SelectDataProps {
  key: number;
  label: string;
  value: string | number;
}

export type MockTypes = {
  id: number;
  title: string;
  subtitle?: string;
  icon?: any;
  key?: string;
  link?: string;
  img?: ImageSourcePropType;
  external?: boolean;
};

export type MenuTypes = {
  id: number;
  bgcolor?: string;
  color?: string;
  icon?: any;
  name?: string;
  link?: string;
  type?: string;
  nested?: string;
  details?: {
    [keyof: string]: string;
  };
};

export type ListCardProps = {
  list: MockTypes[];
  onItemPress?: (arg0: string) => void;
  openFaqSheet?: () => void;
} & YStackProps;

export type FAQProps = {
  faqs: FAQTypes[];
};

export type HeaderAuthProps = {
  noBckArrow?: boolean;
  noLogo?: boolean;
  headerTitle?: string;
  bckArrowFunc?: () => void;
} & XStackProps;

export type SuccessModalProps = {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  onSwipeComplete: () => void;
  closeModal: () => void;
  onPress?: () => void;
  title: string;
  message?: string;
};

export type ServiceRequestTypes = {
  id: string;
  name: string;
  description: string;
  system: boolean;
};

export type RequestFieldTypes = {
  data: string;
  label: string;
  name: string;
  type: string;
};

export type RequestTypes = {
  id: number;
  comments: string;
  entityId: string;
  userType: string;
  requestName: string;
  requester: string;
  body: string;
  currentStatus: string;
  approvalStatus: string;
  dateRequested: string;
  serviceReqConfigId: string;
};

export type NetworkProvider =
  | 'MTN'
  | 'Airtel'
  | 'Glo'
  | '9mobile'
  | 'Smile'
  | 'NTEL'
  | 'Unknown';

export type StepperProps = {
  steps: {
    label: string;
    completed: boolean;
    current?: boolean;
    currentLabel?: string;
  }[];
} & ViewProps;

export type KycLevelProps = {
  cta?: ReactNode;
};

export type AccountLimitsProps = {
  limits: {
    title: string;
    value: string;
  }[];
};

// Define the type for a single limit item
type LimitItem = {
  title: string;
  value: string; // "string" since it includes currency formatting and "Unlimited"
};

// Define the type for a tier
export type Tier = {
  tier: string; // e.g., "Tier1", "Tier2", etc.
  limits: LimitItem[];
};

// Define the type for the overall account limits
export type AccountLimitsTypes = Tier[];

export type AlertCardProps = {
  currentKYCRequestId: string;
  title: string;
  liinkTo?: () => void;
  subtitle: string | null;
  type: 'warning' | 'error' | 'success';
};

// Define the type for each option
export type SelectOption = {
  key: number | string;
  label: string;
  value: string | number;
};
