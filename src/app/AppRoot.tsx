import { StatusBar, StyleSheet, Text, View } from 'react-native';

import { AppProviders } from './AppProviders';

export const AppRoot = () => {
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          Stepper Card
        </Text>
        <Text style={styles.subtitle}>Listo para empezar a desarrollar.</Text>
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
