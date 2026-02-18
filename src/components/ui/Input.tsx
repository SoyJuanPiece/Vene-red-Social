import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { InputProps } from '../../types';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.6,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
  multiline = false,
  keyboardType = 'default',
  maxLength,
  error,
  label,
  style,
}) => {
  const inputStyle: TextStyle[] = [
    styles.input,
    !editable && styles.inputDisabled,
    error && styles.inputError,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {error && (
        <Text variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
