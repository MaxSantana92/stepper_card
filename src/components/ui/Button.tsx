import type { ReactNode, Ref } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  type View,
  type ViewStyle,
} from 'react-native';

import { colors, radii, spacing, typography } from './theme';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  ref?: Ref<View>;
}

const sizePadding: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
};

const sizeFont: Record<ButtonSize, number> = {
  sm: 13,
  md: typography.bodyStrong.fontSize,
  lg: 16,
};

const buildContainerStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean,
): ViewStyle => {
  const padding = sizePadding[size];
  const base: ViewStyle = {
    ...padding,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
  };

  if (variant === 'primary') {
    return {
      ...base,
      backgroundColor: colors.primary,
      borderWidth: 0,
    };
  }

  if (variant === 'outline') {
    return {
      ...base,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    };
  }

  return {
    ...base,
    backgroundColor: 'transparent',
    borderWidth: 0,
  };
};

const buildLabelStyle = (variant: ButtonVariant, size: ButtonSize) => {
  const fontSize = sizeFont[size];

  if (variant === 'primary') {
    return { ...labelStyles.base, fontSize, color: colors.textInverted };
  }

  if (variant === 'outline') {
    return { ...labelStyles.base, fontSize, color: colors.textPrimary };
  }

  return { ...labelStyles.base, fontSize, color: colors.primary };
};

const labelStyles = StyleSheet.create({
  base: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  ref,
  ...rest
}: ButtonProps) => {
  const containerStyle = buildContainerStyle(variant, size, fullWidth, Boolean(disabled));
  const labelStyle = buildLabelStyle(variant, size);

  const handlePress = disabled ? undefined : onPress;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessible
      disabled={disabled}
      onPress={handlePress}
      ref={ref}
      style={containerStyle}
      {...rest}
    >
      <Text style={labelStyle}>{children}</Text>
    </Pressable>
  );
};
