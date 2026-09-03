import { Accounts_ } from './transactions.types';

export type paginator = {
  data: Accounts_[];
  scrollX: any;
  currentIndex?: number;
};
