export type TokenInputModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSuccess?: (token: string) => void;
  title?: string;
  timerMinutes?: number;
  setLoading?: (arg0: boolean) => void;

  requestTokenAPI: () => Promise<boolean>;
  validateTokenAPI?: (token: string) => void;
};

export type RendererProps = {
  index: number;
  symbol: any;
  isFocused: boolean;
};

export type BVNVerificaionProps = {
  setValue: (arg0: string) => void;
  value: string;
  validator: string;
} & TokenInputModalProps;
