/**
 * Catalyst design tokens.
 * Aesthetic: clean iOS — white surfaces, near-black primary actions,
 * slate/navy accent surfaces for success & marketing moments.
 */

export const colors = {
  // Brand
  ink: '#111111', // primary buttons / text
  inkSoft: '#2A2A2E',
  slate: '#33404D', // dark navy header / marketing surfaces
  slateDeep: '#2B3844',

  // Neutrals
  white: '#FFFFFF',
  surface: '#FFFFFF',
  background: '#FFFFFF',
  canvas: '#F4F5F6', // page background behind cards
  border: '#E4E6E9',
  borderStrong: '#C9CDD2',
  fill: '#EDEFF1', // placeholder tiles / image wells
  fillDeep: '#DDE1E5',

  // Text
  text: '#16181B',
  textMuted: '#6B7178',
  textFaint: '#9AA0A6',
  onDark: '#FFFFFF',
  onDarkMuted: '#B9C2CB',

  // Accents / status
  accent: '#4CAF7D', // onboarding green bubble
  success: '#2FA36B',
  danger: '#E5484D',
  warning: '#E7B10A',
  tagBg: '#EEF0F2',
  disabled: '#C9CDD2',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const font = {
  // System font stack; on iOS this maps to San Francisco.
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  title: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8 },
  tiny: { fontSize: 11, fontWeight: '400' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const theme = { colors, spacing, radius, font, shadow };
export type Theme = typeof theme;
