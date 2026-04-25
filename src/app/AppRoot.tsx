import './i18n';

import { useTranslation } from 'react-i18next';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { Body, Heading } from '../components/ui/Typography';
import { colors, radii, spacing } from '../components/ui/theme';
import { StatusCard } from '../features/stepperFlow/components/StatusCard';
import { StepIndicator } from '../features/stepperFlow/components/StepIndicator';
import type { FinancialCard } from '../features/stepperFlow/types';
import { STEPPER_MAX_STEP } from '../features/stepperFlow/types';
import mockData from '../services/mockData.json';
import { AppProviders } from './AppProviders';

const cards = mockData.cards as FinancialCard[];

export const AppRoot = () => {
  const { t } = useTranslation();

  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
        <View style={styles.headerBlock}>
          <Heading accessibilityLabel={t('a11y.home.title')}>{t('common.appTitle')}</Heading>
          <Body accessibilityLabel={t('a11y.home.subtitle')} color={colors.textSecondary}>
            {t('home.readyToStart')}
          </Body>
        </View>

        <StepIndicator currentStep={2} totalSteps={STEPPER_MAX_STEP} />

        <View style={styles.cardsBlock}>
          {cards.map((card) => (
            <StatusCard card={card} key={card.id} />
          ))}
        </View>
      </ScrollView>
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
  cardsBlock: {
    gap: spacing.lg,
  },
});
