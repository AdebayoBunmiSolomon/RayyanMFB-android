import colors from '../theme/color';

export const retailAccountActions = [
  {
    name: 'Transfer',
    icon: 'ExportSquare',
    color: '#4CAF50',
    link: 'Transfer',
    id: 1,
  },
  {
    name: 'Data',
    icon: 'Mobile',
    color: '#2196F3',
    link: 'BillsPage',
    id: 2,
    details: {
      categoryId: '4',
    },
  },
  {
    name: 'Airtime',
    icon: 'CallCalling',
    color: '#FF9800',
    link: 'AirtimeData',
    id: 3,
  },
];

export const corpAccountActions = [
  {
    name: 'Bulk Transfer',
    icon: 'Buildings2',
    color: colors.cyan,
    link: 'BulkTransfer',
    id: 2,
    details: {
      categoryId: '4',
    },
  },
  {
    name: 'Other Bank Transfer',
    icon: 'Bank',
    color: '#4CAF50',
    link: 'Transfer',
    id: 1,
    type: 'other',
  },
  {
    id: 3,
    name: 'Approval',
    color: colors.sunsetOrange,
    icon: 'ClipboardTick',
    link: 'BatchRequests',
    details: {
      nested: 'BulkDetails',
    },
  },
];
