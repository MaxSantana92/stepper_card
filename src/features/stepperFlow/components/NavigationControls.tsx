import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../components/ui/theme';
import { useStepper } from '../hooks/useStepper';
import { STEPPER_MAX_STEP, STEPPER_MIN_STEP } from '../types';

interface NavigationControlsProps {
  onFinish?: () => void;
  style?: ViewStyle;
}

interface NextButtonConfig {
  label: string;
  hint: string;
  disabled: boolean;
  onPress: () => void;
}

export const NavigationControls = ({ onFinish, style }: NavigationControlsProps) => {
  const { t } = useTranslation();
  const { currentStep, selectedCard, isLoading, next, back } = useStepper();

  const isFirstStep = currentStep <= STEPPER_MIN_STEP;
  const isFinalStep = currentStep >= STEPPER_MAX_STEP;
  const isCardSelectionStep = currentStep === 2;
  const requiresSelection = isCardSelectionStep && selectedCard === null;

  const nextConfig = useMemo<NextButtonConfig>(() => {
    if (isFinalStep) {
      return {
        label: t('stepper.navigation.finish'),
        hint: t('a11y.stepper.finishHint'),
        disabled: isLoading || onFinish === undefined,
        onPress: () => {
          onFinish?.();
        },
      };
    }

    if (requiresSelection) {
      return {
        label: t('stepper.navigation.next'),
        hint: t('a11y.stepper.nextDisabledHint'),
        disabled: true,
        onPress: next,
      };
    }

    return {
      label: t('stepper.navigation.next'),
      hint: t('a11y.stepper.nextHint'),
      disabled: isLoading,
      onPress: next,
    };
  }, [isFinalStep, isLoading, onFinish, requiresSelection, next, t]);

  const handleBackPress = useCallback(() => {
    if (!isFirstStep) {
      back();
    }
  }, [isFirstStep, back]);

  const handleNextPress = useCallback(() => {
    if (nextConfig.disabled) {
      return;
    }
    nextConfig.onPress();
  }, [nextConfig]);

  return (
    <View
      accessibilityLabel={t('a11y.stepper.controlsLabel')}
      accessibilityRole="toolbar"
      accessible
      style={[styles.container, style]}
      testID="navigation-controls"
    >
      <View style={styles.buttonSlot}>
        <Button
          accessibilityHint={t('a11y.stepper.backHint')}
          accessibilityLabel={t('stepper.navigation.back')}
          disabled={isFirstStep}
          fullWidth
          onPress={handleBackPress}
          testID="navigation-controls-back"
          variant="outline"
        >
          {t('stepper.navigation.back')}
        </Button>
      </View>

      <View style={styles.buttonSlot}>
        <Button
          accessibilityHint={nextConfig.hint}
          accessibilityLabel={nextConfig.label}
          disabled={nextConfig.disabled}
          fullWidth
          onPress={handleNextPress}
          testID="navigation-controls-next"
          variant="primary"
        >
          {nextConfig.label}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonSlot: {
    flex: 1,
  },
});
