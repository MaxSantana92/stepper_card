import './src/app/i18n'

import { useTranslation } from 'react-i18next'
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'

function App() {
  const { t } = useTranslation()
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text accessibilityLabel={t('a11y.home.title')} style={styles.title}>
        {t('common.appTitle')}
      </Text>
      <Text accessibilityLabel={t('a11y.home.subtitle')} style={styles.subtitle}>
        {t('home.readyToStart')}
      </Text>
    </View>
  )
}

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
})

export default App
