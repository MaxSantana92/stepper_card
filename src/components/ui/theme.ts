export const colors = {
  background: '#ffffff',
  surface: '#f8fafc',

  border: '#e2e8f0',
  borderStrong: '#cbd5e1',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textInverted: '#ffffff',

  primary: '#4f46e5',
  primaryPressed: '#4338ca',
  primaryMuted: '#eef2ff',

  success: '#16a34a',
  successSurface: '#dcfce7',

  danger: '#dc2626',
  dangerSurface: '#fee2e2',

  warning: '#d97706',
  warningSurface: '#fef3c7',

  info: '#0284c7',
  infoSurface: '#e0f2fe',

  neutralSurface: '#f1f5f9',
  neutralOnSurface: '#334155',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const typography = {
  fontFamily: undefined,
  heading: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyStrong: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

export const elevation = {
  card: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
