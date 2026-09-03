const colors = {
  // Primary Islamic Colors - Based on traditional Islamic art
  primary: '#167076', // Deep Teal - Represents trust and stability
  background: '#F8FBF9', // Soft mint white - Clean, pure background
  secondary: '#D4AF37', // Islamic Gold - Represents prosperity and success
  accent: '#009688', // Muted teal - Secondary accent

  // Islamic Green Palette - Symbolizes growth, prosperity, and Islamic values
  softGreen: '#6FCF97', // Softer, lighter green
  lightPrimary: '#4DB6AC', // Light teal
  lighterPrimary: '#B2DFDB', // Teal tint
  darkPrimary: '#004D40', // Deep teal
  islamicGreen: '#2E7D32', // Traditional Islamic green
  prosperityGreen: '#4CAF50', // Growth and success

  // Cool Accents - Professional blues with Islamic significance
  skyBlue: '#4FC3F7', // Sky blue - Represents hope and trust
  royalBlue: '#1976D2', // Royal blue - Authority and trust
  cyan: '#00BCD4',
  trustBlue: '#1565C0', // Trust and reliability

  // Warm Accents - Refined for Islamic aesthetics
  amberYellow: '#FF8F00', // More muted, professional
  goldenYellow: '#F57F17', // Islamic gold variant
  deepOrange: '#E64A19', // Professional orange
  sunsetOrange: '#FF7043',
  coralRed: '#D84315', // Softer, more professional

  // Violets / Purples - Spiritual and dignified
  violet: '#6A1B9A', // Deep violet - Dignity and spirituality
  lavender: '#9575CD', // Soft lavender - Peace and tranquility

  // Neutrals - Enhanced for better hierarchy and Islamic aesthetics
  white: '#FFFFFF', // Pure white - Cleanliness and purity
  black: '#000000',
  grey: '#B0B0B0',
  grey06: '#1A1A1A', // Darker for better contrast
  grey05: '#424242', // Better contrast
  grey04: '#6F6E76',
  grey03: '#9E9E9E',
  lightGrey: '#F5F5F5', // Lighter for subtle backgrounds
  borderColor: '#E8E8E8', // Softer border color

  // Background Tints - Refined for Islamic aesthetics
  darkBackground: '#0D2B36', // Darker, more dignified
  midDarkBackground: '#0E4D64',
  semiLightBackground: '#F0F7F6', // Lighter, more subtle
  lightBackground: '#F8F9FA', // Cleaner light background
  islamicBackground: '#F5F8F5', // Subtle Islamic green tint

  // Input Fields - Enhanced for better UX and Islamic aesthetics
  input: '#FFFFFF', // Pure white for better contrast
  inputBorder: '#E0E0E0', // Consistent with borderColor
  inputFocus: '#167076', // Primary color for focus states
  inputSuccess: '#4CAF50', // Green for successful inputs
  section: '#F8F9FA', // Cleaner section background

  // Text Colors - Improved hierarchy with Islamic values
  darkTextColor: '#0E4D64',
  midDarkTextColor: '#137177',
  semiLightTextColor: '#188977',
  lightTextColor: '#99D492',
  placeholder: '#9E9E9E', // Better contrast
  noText: '#D32F2F', // Softer red

  // Transparent variants - Refined for subtlety and Islamic aesthetics
  borderLine: 'rgba(22, 112, 118, 0.12)', // More subtle
  rgba10: 'rgba(0, 0, 0, 0.06)', // More subtle
  rgba20: 'rgba(0, 0, 0, 0.12)', // More subtle
  rgba30: 'rgba(0, 0, 0, 0.20)', // More subtle
  rgba40: 'rgba(0, 0, 0, 0.30)', // More subtle
  rgba50: 'rgba(0, 0, 0, 0.50)',
  rgba65: 'rgba(0, 0, 0, 0.65)',
  rgba_progress: 'rgba(22, 112, 118, 0.25)', // More subtle

  // Status - Professional status colors with Islamic values
  error: '#D32F2F', // Slightly softer red
  credit: '#388E3C', // Green for positive actions
  debit: '#D32F2F',
  success: '#43A047', // Success green
  warning: '#F57C00', // More professional orange
  info: '#1976D2', // Information blue

  // UI & Icon Utility - Enhanced for consistency and Islamic aesthetics
  slide: '#E0E0E0', // Softer slide color
  slideText: 'rgba(0, 0, 0, 0.75)', // Better contrast
  statusBar: '#FFFFFF',
  userText: '#163303',
  date: '#757575', // Better contrast
  contact: 'rgba(34, 34, 34, 0.85)', // More readable

  // SVG / Decorative - Refined for subtlety and Islamic aesthetics
  svg: '#E8F5E8', // Lighter, more subtle
  svg_: '#132E3A',
  decorativeGold: '#D4AF37', // Islamic decorative gold
  decorativeGreen: '#4CAF50', // Islamic decorative green

  // Box & Stroke - Enhanced for better hierarchy
  darkBox: '#F5F5F5', // Lighter for better contrast
  stroke: '#E0E0E0', // Softer stroke
  stroke_: '#132E3A',
  stroke__: '#0E4D64',
  stroke___: '#538135',
  stroke____: '#0E4D64',
  stroke_____: '#757575', // Better contrast

  // Theme Switch Support
  appPrimary: '#167076', // Keep for backward compatibility
  white_: '#FFF',
  active: '#FFF',

  // New refined colors for better hierarchy and Islamic aesthetics
  cardBackground: '#FFFFFF',
  cardBorder: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.06)', // More subtle shadow
  textPrimary: '#1A1A1A',
  textSecondary: '#424242',
  textTertiary: '#757575',
  divider: '#F0F0F0',

  // Islamic-specific colors
  prayerTime: '#4CAF50', // Green for prayer times
  halal: '#388E3C', // Green for halal indicators
  zakat: '#D4AF37', // Gold for zakat features
  charity: '#4CAF50', // Green for charity features
  islamicPattern: '#E8F5E8', // Subtle pattern background
  trustIndicator: '#1976D2', // Blue for trust indicators

  // FIXED: Missing colors that were causing synchronization issues
  otpBorderColor: '#E0E0E0', // Same as inputBorder for consistency
  successGreen: '#4CAF50', // Consistent success color
  warningOrange: '#F57C00', // Consistent warning color
  infoBlue: '#1976D2', // Consistent info color

  // FIXED: Consolidated border colors for consistency
  primaryBorder: '#167076', // Primary color for important borders
  secondaryBorder: '#D4AF37', // Secondary color for accent borders
  neutralBorder: '#E0E0E0', // Neutral borders (same as inputBorder)
  focusBorder: '#167076', // Focus state borders (same as primary)
  errorBorder: '#D32F2F', // Error state borders
  successBorder: '#4CAF50', // Success state borders
};

export const darkColors = {
  ...colors,
  background: '#101111',
  primary: '#56B870',
  input: '#232525',
  inputBorder: '#424444',
  grey06: '#D2D8D8',
  grey05: '#ABB0B0',
  grey04: '#868A8A',
  white: '#232525',
  borderColor: '#424444',
  whiteSmoke: '#424444',
  semiLightBackground: '#424444',
  rgba10: 'rgba(0, 0, 0, 0.5)',
  section: '#121414',
  
  // Text colors for dark theme - subtle and not too sharp
  textPrimary: '#E8E8E8', // Soft white, not pure white
  textSecondary: '#B8B8B8', // Soft gray
  textTertiary: '#888888', // Medium gray
  darkTextColor: '#E8E8E8', // Soft white for primary text
  midDarkTextColor: '#B8B8B8', // Soft gray for secondary text
  semiLightTextColor: '#888888', // Medium gray for tertiary text
  lightTextColor: '#666666', // Darker gray for light text
  placeholder: '#888888', // Medium gray for placeholders
  userText: '#E8E8E8', // Soft white for user text
  date: '#888888', // Medium gray for dates
  contact: 'rgba(232, 232, 232, 0.8)', // Semi-transparent soft white
};

export const lightColors = {
  ...colors,
  primary: '#167076',
  background: '#FAFAFA',
};

export default colors;
