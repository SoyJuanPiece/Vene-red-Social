// Spacing - Grid 8pt
export const spacing = {
  xs: 4, // 0.25rem
  sm: 8, // 0.5rem
  md: 16, // 1rem
  lg: 24, // 1.5rem
  xl: 32, // 2rem
  xxl: 48, // 3rem
  xxxl: 64, // 4rem
} as const;

export type SpacingSize = keyof typeof spacing;

// Aliases comunes
export const padding = {
  container: spacing.md, // 16px
  card: spacing.md, // 16px
  section: spacing.lg, // 24px
  screen: spacing.md, // 16px horizontal
} as const;

export const margin = {
  component: spacing.md,
  section: spacing.lg,
} as const;

export const gap = {
  tight: spacing.xs, // 4px
  close: spacing.sm, // 8px
  normal: spacing.md, // 16px
  loose: spacing.lg, // 24px
} as const;
