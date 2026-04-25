import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { CardStatusKind } from '../../features/stepperFlow/types';
import { colors, radii, spacing } from './theme';

interface StatusPalette {
  background: string;
  foreground: string;
}

const STATUS_PALETTE: Record<CardStatusKind, StatusPalette> = {
  enabled: { background: colors.successSurface, foreground: colors.success },
  disabled: { background: colors.dangerSurface, foreground: colors.danger },
  paused: { background: colors.warningSurface, foreground: colors.warning },
  unpaused: { background: colors.infoSurface, foreground: colors.info },
};

interface BadgeProps {
  label: string;
  status: CardStatusKind;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const Badge = ({ label, status, accessibilityLabel, style }: BadgeProps) => {
  const palette = STATUS_PALETTE[status];

  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: palette.background,
    ...(style ?? {}),
  };

  const textStyle = {
    ...styles.label,
    color: palette.foreground,
  };

  return (
    <View accessibilityLabel={accessibilityLabel ?? label} accessible style={containerStyle}>
      <Text accessibilityRole="text" style={textStyle}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
