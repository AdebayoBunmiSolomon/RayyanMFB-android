export const isTransactionRepeatable = (
  tranType: string,
  uniqueIdentifier: string,
): boolean => {
  return tranType === 'D' && /^\d+$/.test(uniqueIdentifier);
};
