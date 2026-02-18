import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from '../../components/ui/Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          variant="h1"
          weight="bold"
          color={colors.primary}
          style={styles.logo}
        >
          V
        </Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" style={styles.subtitle}>
          Cargando Venered...
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
