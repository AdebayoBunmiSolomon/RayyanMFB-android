import { Platform, PixelRatio } from 'react-native';
import { Dimensions } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base width and height derived from the current screen size
const BASE_WIDTH = SCREEN_WIDTH;

// Function to normalize sizes (font size, padding, margins, etc.)
export function normalizeSize(size: number) {
  const scale = SCREEN_WIDTH / BASE_WIDTH; // Scale factor for width

  const newSize = size * scale;

  // On iOS, we don't increase the size. We keep it the same or scale down on Android.
  return Platform.OS === 'ios'
    ? newSize // Keep it the same on iOS
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2; // Adjust for Android
}

// Commonly used sizes for font, padding, margin, etc.
const Sizes = {
  // Font Sizes
  fontTiny: normalizeSize(10),
  fontSmall: normalizeSize(13),
  fontMedium: normalizeSize(14),
  fontLarge: normalizeSize(15),
  fontXLarge: normalizeSize(18),
  fontXXLarge: normalizeSize(24),

  // Padding Sizes
  paddingTiny: normalizeSize(4),
  paddingSmall: normalizeSize(8),
  paddingMedium: normalizeSize(16),
  paddingLarge: normalizeSize(24),
  paddingXLarge: normalizeSize(32),

  // Margin Sizes
  marginTiny: normalizeSize(4),
  marginSmall: normalizeSize(8),
  marginMedium: normalizeSize(16),
  marginLarge: normalizeSize(24),
  marginXLarge: normalizeSize(32),

  // Border Radius
  radiusSmall: normalizeSize(8),
  radiusMedium: normalizeSize(12),
  radiusLarge: normalizeSize(14),
  radiusXLarge: normalizeSize(18),

  // Icon Sizes
  iconSmall: normalizeSize(16),
  iconMedium: normalizeSize(24),
  iconLarge: normalizeSize(32),
  iconXLarge: normalizeSize(48),

  // Line Heights
  lineHeightSmall: normalizeSize(18),
  lineHeightMedium: normalizeSize(22),
  lineHeightLarge: normalizeSize(28),
  lineHeightXLarge: normalizeSize(36),

  // Others
  buttonHeight: normalizeSize(48),
  inputHeight: normalizeSize(40),
  separatorHeight: normalizeSize(1),
};

// Export the Sizes object for easy use throughout the application
export default Sizes;
