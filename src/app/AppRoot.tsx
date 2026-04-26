import './i18n';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type ViewToken,
} from 'react-native';

import { Button } from '../components/ui/Button';
import { Body, Heading, Subtitle } from '../components/ui/Typography';
import { colors, radii, spacing } from '../components/ui/theme';
import {
  NavigationControls,
  StatusCard,
  StepIndicator,
  StepRenderer,
} from '../features/stepperFlow/components';
import { StepperProvider } from '../features/stepperFlow/context';
import { useStepper } from '../features/stepperFlow/hooks';
import type { FinancialCard } from '../features/stepperFlow/types';
import { STEPPER_MAX_STEP } from '../features/stepperFlow/types';
import mockData from '../services/mockData.json';
import { AppProviders } from './AppProviders';

const cards = mockData.cards as FinancialCard[];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
// Card occupies most of the viewport but leaves room for the side peeks of
// the previous and next cards. Computed from the full screen width because
// the carousel breaks out of the parent ScrollView padding (see
// `pickerList.marginHorizontal`).
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.82);
const CARD_SIDE_PADDING = Math.max(0, Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2));
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const StepperFlowScreen = () => {
  const { t } = useTranslation();
  const { currentStep, selectedCard, selectCard } = useStepper();

  const handleSelectCard = useCallback(
    (card: FinancialCard) => {
      selectCard(card);
    },
    [selectCard],
  );

  const handleFinish = useCallback(() => {
    // Final step is reached: the maintainer can hook a real callback here
    // (analytics event, navigation back to home, etc.). Kept as a no-op
    // for the demo so screen readers still announce the action.
  }, []);

  // Stable ref to selectCard so onViewableItemsChanged (which must be stable
  // for the lifetime of the FlatList) can always call the latest dispatcher.
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
  }, [currentStep, selectedCard, selectCard]);

  const activeCardIndex = useMemo(() => {
    if (selectedCard === null) {
      return 0;
    }
    const idx = cards.findIndex((card) => card.id === selectedCard.id);
    return idx >= 0 ? idx : 0;
  }, [selectedCard]);

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
      <StepIndicator currentStep={currentStep} totalSteps={STEPPER_MAX_STEP} />
      <StepRenderer />

      {currentStep === 2 ? (
        <View style={styles.pickerBlock}>
          <Subtitle>{t('stepper.details.cardPickerTitle')}</Subtitle>
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
        </View>
      ) : null}

      <NavigationControls onFinish={handleFinish} />
    </View>
  );
};

export const AppRoot = () => {
  const { t, i18n } = useTranslation();

  const isSpanish = i18n.resolvedLanguage?.startsWith('es') ?? i18n.language.startsWith('es');
  const nextLanguage = isSpanish ? 'en' : 'es';
  const switchLanguageLabel = t(`home.languageSwitch.${nextLanguage}`);

  const handleLanguageToggle = useCallback(() => {
    void i18n.changeLanguage(nextLanguage);
  }, [i18n, nextLanguage]);

  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <StepperProvider>
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
          <View style={styles.headerBlock}>
            <Heading accessibilityLabel={t('a11y.home.title')}>{t('common.appTitle')}</Heading>
            <Body accessibilityLabel={t('a11y.home.subtitle')} color={colors.textSecondary}>
              {t('home.flowIntro')}
            </Body>
            <View style={styles.languageAction}>
              <Button
                accessibilityHint={t('a11y.home.languageToggleHint')}
                accessibilityLabel={switchLanguageLabel}
                onPress={handleLanguageToggle}
                size="sm"
                testID="language-toggle-button"
                variant="ghost"
              >
                {switchLanguageLabel}
              </Button>
            </View>
          </View>

          <StepperFlowScreen />
        </ScrollView>
      </StepperProvider>
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  headerBlock: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.lg,
  },
  languageAction: {
    alignSelf: 'flex-start',
  },
  flowBlock: {
    gap: spacing.lg,
  },
  pickerBlock: {
    gap: spacing.md,
  },
  pickerList: {
    // Break out of the parent ScrollView horizontal padding so the carousel
    // spans the full screen width. This is what allows the active card to be
    // perfectly centered with a visible peek of the adjacent cards on each
    // side.
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
