export const isUpdateRequired = (current: string, latest: string): boolean => {
  const currentArr = current.split('.').map(Number);
  const latestArr = latest.split('.').map(Number);

  const length = Math.max(currentArr.length, latestArr.length);

  for (let i = 0; i < length; i++) {
    const currentNum = currentArr[i] || 0;
    const latestNum = latestArr[i] || 0;

    if (currentNum < latestNum) return true; // update needed
    if (currentNum > latestNum) return false; // current is newer
  }

  return false; // versions are equal
};
