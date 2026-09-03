const getAvatarName = (fullName: string) => {
  if (!fullName) return;
  // Split the full name by spaces
  const nameParts = fullName?.trim()?.split(/\s+/);

  // If there's only one part, return the first character
  if (nameParts.length === 1) {
    return nameParts?.[0].charAt(0).toUpperCase();
  }

  // If there are multiple parts, take the first character of the first and last parts
  const firstInitial = nameParts?.[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
};

export default getAvatarName;
