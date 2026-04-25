import './i18n';

import { useTranslation } from 'react-i18next';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import { AppProviders } from './AppProviders';

export const AppRoot = () => {
  const { t } = useTranslation();

  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text
          accessibilityLabel={t('a11y.home.title')}
          accessibilityRole="header"
          style={styles.title}
        >
          {t('common.appTitle')}
        </Text>
        <Text accessibilityLabel={t('a11y.home.subtitle')} style={styles.subtitle}>
          {t('home.readyToStart')}
        </Text>
      </View>
    </AppProviders>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
});
