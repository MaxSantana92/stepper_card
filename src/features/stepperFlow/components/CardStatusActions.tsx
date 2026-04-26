import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { Body } from '../../../components/ui/Typography';
import { colors, spacing } from '../../../components/ui/theme';
import { useStepper } from '../hooks/useStepper';
import {
  CARD_STATUS_TRANSITIONS,
  type CardStatus,
  type CardStatusKind,
  isValidCardStatusTransition,
} from '../types';

interface CardStatusActionsProps {
  style?: ViewStyle;
  showTitle?: boolean;
}

const ACTION_ORDER: readonly CardStatusKind[] = ['enabled', 'paused', 'unpaused', 'disabled'];

const buildPayloadFor = (target: CardStatusKind): CardStatus => {
  switch (target) {
    case 'enabled':
      return { kind: 'enabled' };
    case 'disabled':
      return { kind: 'disabled', reason: 'user_action' };
    case 'paused':
      return { kind: 'paused', pausedAt: new Date().toISOString() };
    case 'unpaused':
      return { kind: 'unpaused', resumedAt: new Date().toISOString() };
  }
};

const variantFor = (target: CardStatusKind): 'primary' | 'outline' =>
  target === 'disabled' ? 'outline' : 'primary';

export const CardStatusActions = ({ style, showTitle = true }: CardStatusActionsProps) => {
  const { t } = useTranslation();
  const { selectedCard, updateCardStatus } = useStepper();

  const currentKind = selectedCard?.status.kind ?? null;

  const actions = useMemo(() => {
    if (currentKind === null) {
      return [] as readonly CardStatusKind[];
    }
    // Show every possible action for transparency, but disable transitions
    // that are not allowed from the current state. This keeps the UI shape
    // stable between renders and helps screen readers announce the rule.
    return ACTION_ORDER.filter((target) => target !== currentKind);
  }, [currentKind]);

  const handlePress = useCallback(
    (target: CardStatusKind) => {
      updateCardStatus(buildPayloadFor(target));
    },
    [updateCardStatus],
  );

  if (selectedCard === null || currentKind === null) {
    return null;
  }

  return (
    <View
      accessibilityLabel={t('a11y.card.actionsLabel')}
      accessibilityRole="toolbar"
      accessible
      style={[styles.container, style]}
      testID="card-status-actions"
    >
      {showTitle ? (
        <Body color={colors.textSecondary} style={styles.title}>
          {t('card.actions.title')}
        </Body>
      ) : null}

      <View style={styles.row}>
        {actions.map((target) => {
          const allowed = isValidCardStatusTransition(currentKind, target);
          const allowedTargets = CARD_STATUS_TRANSITIONS[currentKind];
          const isAllowed = allowed && allowedTargets.includes(target);
          const label = t(`card.actions.${target}`);
          const hint = isAllowed
            ? t(`a11y.card.actionHint.${target}`)
            : t('a11y.card.actionDisabledHint');

          return (
            <View key={target} style={styles.buttonSlot}>
              <Button
                accessibilityHint={hint}
                accessibilityLabel={label}
                disabled={!isAllowed}
                fullWidth
                onPress={() => {
                  handlePress(target);
                }}
                size="sm"
                testID={`card-status-actions-${target}`}
                variant={variantFor(target)}
              >
                {label}
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  buttonSlot: {
    flexGrow: 1,
    flexBasis: '45%',
  },
});
