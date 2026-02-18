import React from 'react';
import {
  Pressable,
  Text as RNText,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { ButtonProps } from '../../types';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  // Sizes
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  secondaryPressed: {
    backgroundColor: colors.secondaryDark,
  },
  text: {
    backgroundColor: 'transparent',
  },
  textPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  destructive: {
    backgroundColor: colors.error,
  },
  destructivePressed: {
    backgroundColor: '#C92A2A',
  },
  // Text styles
  buttonText: {
    ...typography.button,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  textVariantText: {
    color: colors.primary,
  },
  destructiveText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
});

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  } as const;

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    text: styles.text,
    destructive: styles.destructive,
  } as const;

  const pressedVariantStyles = {
    primary: styles.primaryPressed,
    secondary: styles.secondaryPressed,
    text: styles.textPressed,
    destructive: styles.destructivePressed,
  } as const;

  const textVariantStyles = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    text: styles.textVariantText,
    destructive: styles.destructiveText,
  } as const;

  const getBackgroundStyle = (pressed: boolean): ViewStyle => {
    const baseStyle = variantStyles[variant];
    if (disabled) return { ...baseStyle, ...styles.disabledButton };
    
    if (pressed) {
      const pressedStyle = pressedVariantStyles[variant];
      return { ...baseStyle, ...pressedStyle };
    }
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const textStyle = textVariantStyles[variant];
    return { ...styles.buttonText, ...textStyle };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        getBackgroundStyle(pressed),
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'text' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && icon}
          <RNText style={getTextStyle()}>{label}</RNText>
        </>
      )}
    </Pressable>
  );
};

export default Button;
