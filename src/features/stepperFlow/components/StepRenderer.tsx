import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Body, Subtitle } from '../../../components/ui/Typography';
import { colors, elevation, radii, spacing } from '../../../components/ui/theme';
import { useStepper } from '../hooks/useStepper';
import { STEPPER_MAX_STEP, STEPPER_MIN_STEP } from '../types';
import { StatusCard } from './StatusCard';

interface StepRendererProps {
  style?: ViewStyle;
}

const clampStep = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export const StepRenderer = ({ style }: StepRendererProps) => {
  const { t } = useTranslation();
  const { currentStep, selectedCard } = useStepper();

  const safeStep = useMemo(
    () => clampStep(currentStep, STEPPER_MIN_STEP, STEPPER_MAX_STEP),
    [currentStep],
  );

  const accessibilityLabel = t('a11y.stepper.viewLabel', { step: safeStep });

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="none"
      accessible
      style={[styles.container, style]}
      testID={`step-renderer-step-${safeStep}`}
    >
      {safeStep === 1 ? (
        <View style={styles.panel} testID="step-renderer-intro">
          <Subtitle>{t('stepper.steps.intro')}</Subtitle>
          <Body color={colors.textSecondary}>{t('stepper.intro.description')}</Body>
        </View>
      ) : null}

      {safeStep === 2 ? (
        <View style={styles.panel} testID="step-renderer-details">
          <Subtitle>{t('stepper.steps.details')}</Subtitle>
          <Body color={colors.textSecondary}>{t('stepper.details.description')}</Body>
        </View>
      ) : null}

      {safeStep === STEPPER_MAX_STEP ? (
        selectedCard ? (
          <StatusCard card={selectedCard} />
        ) : (
          <View style={styles.panel} testID="step-renderer-status-fallback">
            <Subtitle>{t('stepper.steps.status')}</Subtitle>
            <Body color={colors.textMuted}>{t('stepper.status.fallback')}</Body>
          </View>
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  panel: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...elevation.card,
  },
});
