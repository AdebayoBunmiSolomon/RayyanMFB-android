function truncateMiddleString(text: string) {
  if (text) {
    // Ensure the input is valid
    if (typeof text !== 'string' || text.length < 6) {
      throw new Error(
        'Invalid input. The string must be at least 6 characters long.',
      );
    }

    // Extract the first and last parts of the string
    const firstPart = text?.slice?.(0, 3); // First 3 characters
    const lastPart = text?.slice?.(-3); // Last 3 characters

    // Generate the middle part without using repeat()
    const middlePartLength = text?.length - 6;
    let middlePart = '';
    for (let i = 0; i < middlePartLength; i++) {
      middlePart += '*';
    }

    // Combine the parts
    const truncatedString = firstPart + middlePart + lastPart;

    return truncatedString;
  }
}

export default truncateMiddleString;
