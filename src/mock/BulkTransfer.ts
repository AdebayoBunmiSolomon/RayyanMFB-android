export const options = [
  {
    id: 1,
    title: 'Multiple Rayyan Account Transfer',
    icon: 'Notepad2',
    link: 'BulkMultiTransfer',
    type: 'rayyan',
  },
  {
    id: 2,
    title: 'Multiple Other Banks Transfers',
    icon: 'Notepad2',
    link: 'BulkMultiTransfer',
    type: 'other',
  },
  {
    id: 3,
    title: 'Bulk Transfer Status',
    icon: 'TaskSquare',
    link: 'BatchRequests',
    nested: 'BulkTransferStatus',
  },
  {
    id: 4,
    title: 'Approvals',
    icon: 'FilterTick',
    link: 'BatchRequests',
    nested: 'BulkDetails',
  },
  {
    id: 4,
    title: 'Uncompleted Transfers',
    icon: 'NoteAdd',
    link: 'TransferSummary',
  },
];

export const summary = [
  {
    id: 1,
    name: 'Adekunle David Olamilekan',
    account: '0075790971',
    narration: 'JULY SALAY',
    amount: '1,000.00',
    status: 'APPROVED',
  },
  {
    id: 2,
    name: 'Adekunle David Olamilekan',
    account: '0075790971',
    narration: 'JULY SALAY',
    amount: '1,000.00',
    status: 'APPROVED',
  },
  {
    id: 3,
    name: 'Adekunle David Olamilekan',
    account: '0075790971',
    narration: 'JULY SALAY',
    amount: '1,000.00',
    status: 'PENDING',
  },
];
