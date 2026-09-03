import { createFont } from 'tamagui';

// Islamic-inspired typography system
// Clean, professional fonts that reflect Islamic values of clarity and dignity

export const fonts = {
  // Primary fonts - Clean and professional
  heading: createFont({
    family: 'Inter-Bold',
    size: {
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 48,
    },
    lineHeight: {
      1: 16,
      2: 20,
      3: 24,
      4: 28,
      5: 32,
      6: 36,
      7: 40,
      8: 44,
      9: 48,
      10: 60,
    },
    weight: {
      1: '400',
      2: '500',
      3: '600',
      4: '700',
      5: '800',
    },
    letterSpacing: {
      1: 0,
      2: 0.5,
      3: 1,
      4: 1.5,
      5: 2,
    },
  }),

  body: createFont({
    family: 'Inter-Regular',
    size: {
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
      6: 24,
    },
    lineHeight: {
      1: 16,
      2: 20,
      3: 24,
      4: 28,
      5: 32,
      6: 36,
    },
    weight: {
      1: '400',
      2: '500',
      3: '600',
    },
    letterSpacing: {
      1: 0,
      2: 0.25,
      3: 0.5,
    },
  }),

  // Islamic decorative font for special elements
  decorative: createFont({
    family: 'IvyMode-Regular',
    size: {
      1: 14,
      2: 16,
      3: 18,
      4: 20,
      5: 24,
      6: 28,
    },
    lineHeight: {
      1: 20,
      2: 24,
      3: 28,
      4: 32,
      5: 36,
      6: 40,
    },
    weight: {
      1: '400',
      2: '500',
      3: '600',
    },
    letterSpacing: {
      1: 0.5,
      2: 1,
      3: 1.5,
    },
  }),
};

// Typography scale for consistent text sizing
export const typography = {
  // Headings - Clear hierarchy
  h1: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  h3: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  h4: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  h5: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  h6: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.25,
  },

  // Body text - Readable and professional
  bodyLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodyMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodyXSmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.25,
  },

  // Special text styles
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  overline: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.25,
  },

  // Islamic decorative text for special elements
  islamicTitle: {
    fontFamily: 'IvyMode-Bold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  prayerTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  quranText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
};

export default typography;
