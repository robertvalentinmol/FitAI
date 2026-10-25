// Paleta de colores principal
export const Colors = {
  // Fondos
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceAlt: '#222536',
  card: '#1E2130',

  // Verdes (acento principal)
  primary: '#1DB97A',
  primaryDark: '#0F8A58',
  primaryLight: '#27E896',
  primaryMuted: '#1DB97A22',

  // Texto
  textPrimary: '#F0F2F8',
  textSecondary: '#8B90A7',
  textMuted: '#4A5068',

  // Bordes
  border: '#2A2D3E',
  borderActive: '#1DB97A',

  // Semánticos
  danger: '#E05C5C',
  warning: '#E09A3A',
  info: '#4A90D9',

  // Tabs
  tabActive: '#1DB97A',
  tabInactive: '#4A5068',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
