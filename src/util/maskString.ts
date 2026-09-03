const maskString = (text: string, visibleCount: number = 4, maskChar = '.') => {
  if (text.length <= visibleCount) return text;

  const maskedPart = maskChar.repeat(text.length - visibleCount);
  const visiblePart = text.slice(-visibleCount);

  return maskedPart + visiblePart;
};

export default maskString;
