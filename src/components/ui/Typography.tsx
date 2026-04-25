import type { ReactNode, Ref } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from './theme';

type AccessibilityRole = TextProps['accessibilityRole'];

interface TypographyBaseProps extends Omit<TextProps, 'children' | 'style'> {
  children: ReactNode;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
  ref?: Ref<Text>;
}

const buildTextStyle = (
  base: TextStyle,
  color: string | undefined,
  align: TextStyle['textAlign'] | undefined,
  override: TextStyle | undefined,
): TextStyle => ({
  ...base,
  color: color ?? (base.color as string | undefined) ?? colors.textPrimary,
  textAlign: align ?? base.textAlign,
  ...(override ?? {}),
});

const styles = StyleSheet.create({
  heading: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export const Heading = ({
  children,
  color,
  align,
  style,
  accessibilityRole = 'header' as AccessibilityRole,
  ...rest
}: TypographyBaseProps) => {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      style={buildTextStyle(styles.heading, color, align, style)}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Subtitle = ({
  children,
  color,
  align,
  style,
  accessibilityRole,
  ...rest
}: TypographyBaseProps) => {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      style={buildTextStyle(styles.subtitle, color, align, style)}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Body = ({
  children,
  color,
  align,
  style,
  accessibilityRole,
  ...rest
}: TypographyBaseProps) => {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      style={buildTextStyle(styles.body, color, align, style)}
      {...rest}
    >
      {children}
    </Text>
  );
};
