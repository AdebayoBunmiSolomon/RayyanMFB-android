// import { useEffect, useState } from "react";
// import { useApi } from "../useApi";
// import { StandingOrderResponse } from "../../types/transfer.types";
// import { useAppSelector } from "../hook";

// export const useGetStandingOrder = () => {
//   const { accounts } = useAppSelector(state => state.account);
//     const getStandingOrders = useApi({ endpoint: 'getStandingOrderOfAUser' });
//       const [orderState, setOrderState] = useState<'History' | 'Transfer'>(
//         'History',
//       );
//       const [loadingGetReq, setLoadingGetReq] = useState(false);
//         const [standingOrderData, setStandingOrderData] = useState<
//           StandingOrderResponse[]
//         >([]);

//         useEffect(() => {
//           if (orderState !== 'History') return;

//           const initiateGetStandingOrder = async () => {
//             setLoadingGetReq(true);
//             try {
//               const res = await getStandingOrders.requestInit(
//                 undefined,
//                 `/v1/retail/directdebit?page=0&size=20&sort=id,desc`,
//               );
//               if (res?.data?.data && res?.data?.data?.content?.length > 0) {
//                 setStandingOrderData(
//                   res?.data?.data?.content as StandingOrderResponse[],
//                 );
//               }
//             } catch (err) {
//               console.log('Error fetching standing orders:', err);
//             } finally {
//               setLoadingGetReq(false);
//             }
//           };

//           initiateGetStandingOrder();
//         }, [orderState, accounts]);

//         return {
//             loadingGetReq,
//             standingOrderData,
//             orderState,
//             setOrderState,
//         }
// }

import { useEffect, useState } from 'react';
import { useApi } from '../useApi';
import { useAppSelector, useAppDispatch } from '../hook';
import { setStandingOrders } from '../../slices/standingOrderSlice';

export const useGetStandingOrder = () => {
  const dispatch = useAppDispatch();
  const standingOrderData = useAppSelector(state => state.standingOrder.data); // 👈 read from store
  const getStandingOrders = useApi({ endpoint: 'getStandingOrderOfAUser' });
  const [orderState, setOrderState] = useState<'History' | 'Transfer'>(
    'History',
  );
  const [loadingGetReq, setLoadingGetReq] = useState(false);

  const initiateGetStandingOrder = async () => {
    setLoadingGetReq(true);
    try {
      const res = await getStandingOrders.requestInit(
        undefined,
        `/v1/retail/directdebit?page=0&size=20&sort=id,desc`,
      );
      if (res?.data?.data && res?.data?.data?.content?.length > 0) {
        dispatch(setStandingOrders(res?.data?.data?.content)); // 👈 save to store
      } else {
        dispatch(setStandingOrders([])); // clear if empty
      }
    } catch (err) {
      console.log('Error fetching standing orders:', err);
    } finally {
      setLoadingGetReq(false);
    }
  };

  useEffect(() => {
    if (orderState !== 'History') return;
    initiateGetStandingOrder();
  }, [orderState]); // 👈 remove refreshTrigger

  return {
    loadingGetReq,
    standingOrderData, // now from store
    orderState,
    setOrderState,
    initiateGetStandingOrder,
  };
};
