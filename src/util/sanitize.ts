export const NARRATION_REGEX = /^[a-zA-Z0-9\s.,\-/']*$/;

export const sanitizeNarration = (text: string): string =>
  text.replace(/[^a-zA-Z0-9\s.,\-/']/g, '');
