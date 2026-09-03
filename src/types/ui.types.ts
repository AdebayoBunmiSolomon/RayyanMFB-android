import { ReactNode } from 'react';

export type CheckboxProps = {
  value: boolean;
  setValue: (arg0: boolean) => void;
  label: string | ReactNode;
};
