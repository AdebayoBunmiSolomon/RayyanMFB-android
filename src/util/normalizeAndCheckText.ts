function normalizeAndCheckText(input: string, target: string) {
  if (typeof input !== 'string') return false;

  // Normalize whitespace: replace multiple spaces with a single space
  const normalizedInput = input.replace(/\s+/g, ' ').trim();
  return normalizedInput.includes(target);
}

export default normalizeAndCheckText;
