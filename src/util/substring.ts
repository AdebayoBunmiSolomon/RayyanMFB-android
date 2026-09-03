const substring = (text: string, len: number, fromEnd = false) => {
  if (text.length <= len) return text;

  return fromEnd
    ? '...' + text.slice(text.length - len)
    : text.slice(0, len) + '...';
};

export default substring;
