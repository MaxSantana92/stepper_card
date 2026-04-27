import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
  type ViewToken,
} from 'react-native';

import { Subtitle } from '../../../components/ui/Typography';
import { colors, radii, spacing } from '../../../components/ui/theme';
import { useCards } from '../hooks/useCards';
import { useStepper } from '../hooks/useStepper';
import type { FinancialCard } from '../types';
import { NavigationControls } from './NavigationControls';
import { StatusCard } from './StatusCard';
import { StepIndicator } from './StepIndicator';
import { StepRenderer } from './StepRenderer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.82);
const CARD_SIDE_PADDING = Math.max(0, Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2));
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export const StepperFlowScreen = () => {
  const { t } = useTranslation();
  const { currentStep, selectedCard, selectCard } = useStepper();
  const { cards, isLoading } = useCards();

  const handleSelectCard = useCallback(
    (card: FinancialCard) => {
      selectCard(card);
    },
    [selectCard],
  );

  const handleFinish = useCallback(() => {
    // Final step reached: the maintainer can hook a real callback here
    // (analytics event, navigation back to home, etc.).
  }, []);

  const selectCardRef = useRef(selectCard);
  useEffect(() => {
    selectCardRef.current = selectCard;
  }, [selectCard]);

  useEffect(() => {
    if (currentStep === 2 && selectedCard === null && cards.length > 0) {
      const firstCard = cards[0];
      if (firstCard) {
        selectCard(firstCard);
      }
    }
  }, [currentStep, selectedCard, selectCard, cards]);

  const activeCardIndex = useMemo(() => {
    if (selectedCard === null) {
      return 0;
    }
    const idx = cards.findIndex((card) => card.id === selectedCard.id);
    return idx >= 0 ? idx : 0;
  }, [selectedCard, cards]);

  const initialScrollIndex = activeCardIndex;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as FinancialCard | undefined;
    if (first) {
      selectCardRef.current(first);
    }
  }).current;

  const renderCardItem = useCallback(
    ({ item: card }: ListRenderItemInfo<FinancialCard>) => {
      const isSelected = selectedCard?.id === card.id;
      return (
        <View style={styles.pickerSlot}>
          <Pressable
            accessibilityHint={t('a11y.stepper.cardCarouselHint')}
            accessibilityLabel={t('a11y.card.summary', {
              type: t(`card.types.${card.type}`),
              lastFour: card.lastFour,
              status: t(`card.statuses.${card.status.kind}`),
            })}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessible
            onPress={() => {
              handleSelectCard(card);
            }}
            style={[styles.pickerOption, isSelected ? styles.pickerOptionSelected : null]}
            testID={`app-root-card-option-${card.id}`}
          >
            <StatusCard card={card} style={styles.pickerCard} />
          </Pressable>
        </View>
      );
    },
    [handleSelectCard, selectedCard, t],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<FinancialCard> | null | undefined, index: number) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((card: FinancialCard) => card.id, []);

  return (
    <View style={styles.flowBlock}>
      <StepIndicator currentStep={currentStep} totalSteps={3} />
      <StepRenderer />

      {currentStep === 2 ? (
        <View style={styles.pickerBlock}>
          <Subtitle>{t('stepper.details.cardPickerTitle')}</Subtitle>
          {isLoading && cards.length === 0 ? (
            <ActivityIndicator
              color={colors.primary}
              size="large"
              testID="cards-loading-indicator"
            />
          ) : (
            <>
              <FlatList<FinancialCard>
                accessibilityLabel={t('a11y.stepper.cardPickerLabel')}
                accessibilityRole="radiogroup"
                accessible
                contentContainerStyle={styles.pickerListContent}
                data={cards}
                decelerationRate="fast"
                getItemLayout={getItemLayout}
                horizontal
                initialScrollIndex={initialScrollIndex}
                keyExtractor={keyExtractor}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={renderCardItem}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                snapToInterval={SNAP_INTERVAL}
                style={styles.pickerList}
                testID="app-root-card-picker"
                viewabilityConfig={viewabilityConfig}
              />
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.pickerDots}
                testID="app-root-card-dots"
              >
                {cards.map((card, index) => {
                  const isActive = index === activeCardIndex;
                  return (
                    <View
                      key={card.id}
                      style={[styles.pickerDot, isActive ? styles.pickerDotActive : null]}
                      testID={`app-root-card-dot-${card.id}`}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
      ) : null}

      <NavigationControls onFinish={handleFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  flowBlock: {
    gap: spacing.lg,
  },
  pickerBlock: {
    gap: spacing.md,
  },
  pickerList: {
    marginHorizontal: -spacing.xl,
  },
  pickerListContent: {
    paddingHorizontal: CARD_SIDE_PADDING,
    gap: CARD_GAP,
  },
  pickerSlot: {
    width: CARD_WIDTH,
  },
  pickerOption: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  pickerOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  pickerCard: {
    borderLeftWidth: 4,
  },
  pickerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  pickerDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.borderStrong,
  },
  pickerDotActive: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
});
