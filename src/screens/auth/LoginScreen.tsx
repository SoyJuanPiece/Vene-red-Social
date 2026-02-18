import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
  divider: {
    marginVertical: spacing.lg,
    alignItems: 'center',
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  link: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  linkText: {
    color: colors.textSecondary,
  },
  linkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorAlert: {
    backgroundColor: colors.error + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
  },
});

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });
    } catch (err: any) {
      setError(err.message || 'Error iniciando sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="h1"
            weight="bold"
            color={colors.primary}
            style={styles.logo}
          >
            V
          </Text>
          <Text variant="h2" weight="bold" style={styles.title}>
            Bienvenido
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Inicia sesión en tu cuenta
          </Text>
        </View>

        {/* Error Alert */}
        {error && (
          <View style={styles.errorAlert}>
            <Text variant="body" style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <Button
            label={loading ? 'Iniciando...' : 'Iniciar Sesión'}
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            fullWidth
            style={styles.button}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <Text variant="body" style={styles.dividerText}>
            ¿No tienes cuenta?
          </Text>
        </View>

        {/* Sign Up Link */}
        <View style={styles.link}>
          <Text variant="body" style={styles.linkText}>
            Crea una nueva cuenta
          </Text>
          <Button
            label="Registrarse"
            variant="text"
            size="small"
            onPress={() => navigation.navigate('SignUp')}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
