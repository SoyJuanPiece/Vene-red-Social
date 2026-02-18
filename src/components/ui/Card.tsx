import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../../theme/colors';
import { CardProps } from '../../types';

const styles = StyleSheet.create({
  // Variants
  default: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  flat: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  outlined: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressable: {
    opacity: 0.8,
  },
});

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  onPress,
  style,
}) => {
  const cardStyle = styles[variant as keyof typeof styles];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressable,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export default Card;
