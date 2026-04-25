import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Body } from '../../../components/ui/Typography';
import { colors, radii, spacing } from '../../../components/ui/theme';
import { STEPPER_MAX_STEP, STEPPER_MIN_STEP } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  style?: ViewStyle;
  showLabel?: boolean;
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

export const StepIndicator = ({
  currentStep,
  totalSteps = STEPPER_MAX_STEP,
  style,
  showLabel = true,
}: StepIndicatorProps) => {
  const { t } = useTranslation();
  const safeMin = STEPPER_MIN_STEP;
  const safeMax = totalSteps;
  const safeCurrent = clampStep(currentStep, safeMin, safeMax);

  const segments = useMemo(
    () => Array.from({ length: totalSteps }, (_, index) => index + 1),
    [totalSteps],
  );

  return (
    <View
      accessibilityHint={t('a11y.stepper.indicatorHint')}
      accessibilityLabel={t('stepper.indicator.label')}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: safeMin,
        max: safeMax,
        now: safeCurrent,
      }}
      accessible
      style={[styles.container, style]}
    >
      <View style={styles.track}>
        {segments.map((step) => {
          const isActiveOrCompleted = step <= safeCurrent;
          const segmentStyle: ViewStyle = {
            ...styles.segment,
            backgroundColor: isActiveOrCompleted ? colors.primary : colors.border,
          };

          return (
            <View
              accessibilityElementsHidden
              key={step}
              style={segmentStyle}
              testID={`step-indicator-segment-${step}`}
            />
          );
        })}
      </View>

      {showLabel ? (
        <Body color={colors.textMuted} style={styles.label}>
          {t('stepper.indicator.progress', { current: safeCurrent, total: safeMax })}
        </Body>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  track: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radii.pill,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
