// Islamic-inspired spacing system
// Based on geometric proportions and the golden ratio for harmonious layouts

export const spacing = {
  // Base spacing unit (8px) - Follows 8-point grid system
  base: 8,

  // Micro spacing - For fine adjustments
  xs: 4, // 4px
  sm: 8, // 8px
  md: 16, // 16px
  lg: 24, // 24px
  xl: 32, // 32px
  xxl: 48, // 48px
  xxxl: 64, // 64px

  // Component-specific spacing
  component: {
    padding: {
      xs: 8, // Small components
      sm: 12, // Medium components
      md: 16, // Standard components
      lg: 20, // Large components
      xl: 24, // Extra large components
    },
    margin: {
      xs: 8, // Small margins
      sm: 12, // Medium margins
      md: 16, // Standard margins
      lg: 20, // Large margins
      xl: 24, // Extra large margins
    },
    gap: {
      xs: 4, // Tight spacing
      sm: 8, // Compact spacing
      md: 12, // Standard spacing
      lg: 16, // Comfortable spacing
      xl: 20, // Loose spacing
    },
  },

  // Layout spacing - Based on Islamic geometric principles
  layout: {
    section: 32, // Section spacing
    container: 24, // Container spacing
    card: 16, // Card spacing
    form: 20, // Form spacing
    button: 16, // Button spacing
    input: 12, // Input spacing
    list: 8, // List item spacing
  },

  // Screen spacing - For consistent screen layouts
  screen: {
    padding: 20, // Screen padding
    margin: 16, // Screen margin
    safeArea: 24, // Safe area spacing
  },

  // Islamic geometric proportions
  islamic: {
    // Based on golden ratio (1.618)
    golden: 1.618,

    // Proportional spacing
    proportion1: 8, // Base unit
    proportion2: 13, // Base * golden ratio
    proportion3: 21, // Base * golden ratio²
    proportion4: 34, // Base * golden ratio³

    // Prayer time spacing
    prayerSection: 40,
    prayerItem: 16,

    // Zakat and charity spacing
    charitySection: 36,
    charityItem: 20,
  },
};

// Spacing scale for consistent use
export const space = {
  // Common spacing values
  0: 0,
  1: spacing.xs, // 4px
  2: spacing.sm, // 8px
  3: spacing.md, // 16px
  4: spacing.lg, // 24px
  5: spacing.xl, // 32px
  6: spacing.xxl, // 48px
  7: spacing.xxxl, // 64px

  // Component spacing
  component: spacing.component,

  // Layout spacing
  layout: spacing.layout,

  // Screen spacing
  screen: spacing.screen,

  // Islamic spacing
  islamic: spacing.islamic,
};

export default spacing;
