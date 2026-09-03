// useBillsLogic.ts
import { useState } from 'react';
import { useAppDispatch } from '../hook';
import { useLazyGetDebitAccountsQuery } from '../../api/transfer';
import { useApi } from '../useApi';
import {
  AddBillBeneficiary_,
  BillItems,
  BillsDetails,
  Categories,
  CategoryBills,
} from '../../types/bills-payments.types';
import { setDebitAccounts } from '../../slices/transferSlice';
import { SelectOption } from '../../types';

export type BillsDetailsWithSelect = BillsDetails & SelectOption;

export const useBillsLogic = () => {
  const dispatch = useAppDispatch();
  const debitAccount = useLazyGetDebitAccountsQuery()[0];
  const listCategories = useApi({ endpoint: 'listCategories' });
  const listBillersByCategoryName = useApi({
    endpoint: 'listBillersByCategoryName',
  });
  const listProductsByBillerID = useApi({ endpoint: 'listProductsByBillerID' });
  const listBillerBeneficiaries = useApi({
    endpoint: 'getAllBillerBeneficiaries',
  });

  const [loading, setLoading] = useState({
    category: false,
    bill: false,
    product: false,
  });
  const [categories, setCategories] = useState<BillsDetailsWithSelect[]>([]);
  const [billers, setBillers] = useState<BillsDetailsWithSelect[]>([]);
  const [products, setProducts] = useState<BillsDetailsWithSelect[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<
    AddBillBeneficiary_[] | undefined
  >();

  const getBillerBeneficiaries = async () => {
    try {
      const res = await listBillerBeneficiaries.requestInit();
      if (res?.data?.response?.length) {
        setBeneficiaries(res?.data?.response);
      }
    } catch (error) {
    } finally {
    }
  };

  const getCategories = async () => {
    setLoading(prev => ({ ...prev, category: true }));
    try {
      const res = await listCategories.requestInit();
      if (res?.data?.length) {
        const categoryMap = res.data.map(
          ({ categoryId, id, categoryName }: Categories) => ({
            label: categoryName,
            value: categoryId,
            key: id,
          }),
        );
        setCategories(categoryMap);
      }
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  };

  const getBillers = async (categoryName: string) => {
    setLoading(prev => ({ ...prev, bill: true }));
    try {
      const res = await listBillersByCategoryName.requestInit(
        undefined,
        `/v1/bills-payment/categories/${categoryName}/bills`,
      );
      if (res?.data?.length) {
        setBillers(
          res.data.map(
            ({ billerId, billerName, id, ...rest }: CategoryBills) => ({
              ...rest,
              label: billerName,
              value: String(billerId),
              key: id,
            }),
          ),
        );
      }
    } finally {
      setLoading(prev => ({ ...prev, bill: false }));
    }
  };

  const getProducts = async (billerId: string) => {
    setLoading(prev => ({ ...prev, product: true }));
    try {
      const res = await listProductsByBillerID.requestInit(
        undefined,
        `/v1/bills-payment/bills/${billerId}/payment-items`,
      );
      if (res?.data?.length) {
        setProducts(
          res.data.map((product: BillItems) => ({
            ...product,
            label: product.paymentItemName,
            value: String(product.paymentItemId),
            key: product.id,
          })),
        );
      }
    } finally {
      setLoading(prev => ({ ...prev, product: false }));
    }
  };

  const getUserDebitAccounts = async () => {
    try {
      const res = await debitAccount().unwrap();
      if (res.code === '00') {
        dispatch(setDebitAccounts(res));
      }
    } catch (_) {}
  };

  return {
    categories,
    billers,
    products,
    beneficiaries,
    loading,
    getCategories,
    getBillers,
    getProducts,
    getUserDebitAccounts,
    getBillerBeneficiaries,
  };
};
