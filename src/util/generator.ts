/**
 * Generates a unique number by combining the current timestamp with a random suffix.
 * Ensures uniqueness even across multiple sessions.
 */
export function generateUniqueNumber(): number {
  const timestamp = Date.now(); // e.g., 1713000000000
  const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return Number(`${timestamp}${randomSuffix}`);
}
