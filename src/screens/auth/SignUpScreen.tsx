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
import { SignUpData } from '../../types';

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
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
  helper: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 12,
  },
});

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    email: '',
    username: '',
    display_name: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = 'Email requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email inválido';

    if (!form.username) newErrors.username = 'Usuario requerido';
    else if (form.username.length < 3)
      newErrors.username = 'Mínimo 3 caracteres';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      newErrors.username = 'Solo letras, números y _';

    if (!form.display_name) newErrors.display_name = 'Nombre requerido';

    if (!form.password) newErrors.password = 'Contraseña requerida';
    else if (form.password.length < 6)
      newErrors.password = 'Mínimo 6 caracteres';

    if (form.password !== form.passwordConfirm)
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const signUpData: SignUpData = {
        email: form.email,
        username: form.username,
        display_name: form.display_name,
        password: form.password,
      };
      await signUp(signUpData);
    } catch (err: any) {
      setError(err.message || 'Error registrándose');
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
            Únete a Venered
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Crea una nueva cuenta
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
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, email: text }))
            }
            keyboardType="email-address"
            editable={!loading}
            error={errors.email}
          />

          <Input
            label="Nombre de usuario"
            placeholder="mi_usuario"
            value={form.username}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, username: text }))
            }
            editable={!loading}
            error={errors.username}
          />
          <Text variant="caption" style={styles.helper}>
            Solo letras, números y guiones bajos
          </Text>

          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={form.display_name}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, display_name: text }))
            }
            editable={!loading}
            error={errors.display_name}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={form.password}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, password: text }))
            }
            secureTextEntry
            editable={!loading}
            error={errors.password}
          />

          <Input
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={form.passwordConfirm}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, passwordConfirm: text }))
            }
            secureTextEntry
            editable={!loading}
            error={errors.passwordConfirm}
          />

          <Button
            label={loading ? 'Registrándose...' : 'Crear Cuenta'}
            onPress={handleSignUp}
            disabled={loading}
            loading={loading}
            fullWidth
            style={styles.button}
          />
        </View>

        {/* Login Link */}
        <View style={styles.link}>
          <Text variant="body" style={styles.linkText}>
            ¿Ya tienes cuenta?
          </Text>
          <Button
            label="Inicia sesión"
            variant="text"
            size="small"
            onPress={() => navigation.navigate('Login')}
            style={{ paddingHorizontal: 0 }}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
