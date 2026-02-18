import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography, TypographyVariant } from '../../theme/typography';
import { TextProps } from '../../types';

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
  },
});

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  weight,
  children,
  style,
}) => {
  const variantStyle = typography[variant as TypographyVariant];
  
  const weightMap: Record<string, string> = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };

  const fontWeight = weight ? weightMap[weight] : variantStyle.fontWeight;

  return (
    <RNText
      style={[
        styles.text,
        variantStyle,
        color && { color },
        weight && { fontWeight },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

export default Text;
