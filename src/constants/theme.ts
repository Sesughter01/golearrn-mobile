export const COLORS = {
  primaryBlue: '#2E75C7',
  primaryCyan: '#2CC7E6',
  darkNavy: '#101C2C',
  deepNavy: '#0B1625',
  white: '#FFFFFF',
  lightBackground: '#F5F8FC',
  cardBackground: '#FFFFFF',
  primaryText: '#101C2C',
  secondaryText: '#809AAA',
  border: '#D8E3EF',
  borderStrong: '#B9CCDE',
  error: '#EF4444',
  success: '#2CC7E6',
  ratingGold: '#FFC400',
  onDarkText: '#DCEBFF',
  onDarkMuted: '#C7D6E6',
  successSoft: '#D9F7FC',
  warningSoft: '#FFF5CC',
  errorSoft: '#FDE3E3',
  navySoft: '#E8F0F8',
  overlay: 'rgba(11, 22, 37, 0.18)',
  overlayStrong: 'rgba(11, 22, 37, 0.62)',
  cyanGlow: 'rgba(44, 199, 230, 0.20)',
} as const;

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 30,
  hero: 38,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: COLORS.deepNavy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  soft: {
    shadowColor: COLORS.deepNavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;

export const LAYOUT = {
  screenMaxWidth: 720,
  contentWidth: '100%' as const,
  touchTarget: 52,
} as const;

export const colors = {
  background: COLORS.lightBackground,
  surface: COLORS.cardBackground,
  surfaceMuted: COLORS.navySoft,
  text: COLORS.primaryText,
  textMuted: COLORS.secondaryText,
  primary: COLORS.primaryBlue,
  primaryDark: COLORS.darkNavy,
  primarySoft: COLORS.successSoft,
  border: COLORS.border,
  borderStrong: COLORS.borderStrong,
  success: COLORS.success,
  warning: COLORS.ratingGold,
  danger: COLORS.error,
} as const;

export const spacing = SPACING;
export const radii = RADIUS;
