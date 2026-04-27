import './i18n';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Body, Heading } from '../components/ui/Typography';
import { colors, radii, spacing } from '../components/ui/theme';
import { StepperFlowScreen } from '../features/stepperFlow/components';
import { StepperProvider } from '../features/stepperFlow/context';
import { AppProviders } from './AppProviders';

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
});
