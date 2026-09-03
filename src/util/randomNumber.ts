/**
 * Generates a random number between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum number (inclusive).
 * @param {number} max - The maximum number (inclusive).
 * @returns {number} - A random number between min and max.
 */
const randomNumber = (min: number = 0, max: number = 100): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default randomNumber;
