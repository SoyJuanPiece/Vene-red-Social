import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { AvatarProps } from '../../types';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sizes
  xs: { width: 24, height: 24, borderRadius: 12 },
  sm: { width: 32, height: 32, borderRadius: 16 },
  md: { width: 40, height: 40, borderRadius: 20 },
  lg: { width: 56, height: 56, borderRadius: 28 },
  xl: { width: 72, height: 72, borderRadius: 36 },
  xxl: { width: 96, height: 96, borderRadius: 48 },
  
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: colors.primary,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRing: {
    borderWidth: 2,
    borderColor: colors.secondary,
  },
});

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'md',
  placeholder = '?',
  showStoryRing = false,
  hasStory = false,
  style,
}) => {
  const sizeStyle = styles[size as keyof typeof styles] as {
    width: number;
    height: number;
    borderRadius: number;
  };
  const borderRadius = (sizeStyle.width as number) / 2;
  
  const avatarStyle: ViewStyle = {
    ...styles.container,
    ...sizeStyle,
    borderRadius,
    ...((hasStory || showStoryRing) && styles.storyRing),
  };

  // Calcular tamaño del texto basado en size
  const fontSizeMap = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
  };

  return (
    <View style={[avatarStyle, style]}>
      {source ? (
        <Image
          source={source}
          style={[styles.image, { borderRadius }]}
        />
      ) : (
        <View
          style={[styles.placeholder, { borderRadius }]}
        >
          <Text
            variant="h4"
            color="#FFFFFF"
            weight="bold"
            style={{ fontSize: fontSizeMap[size as keyof typeof fontSizeMap] }}
          >
            {placeholder?.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Avatar;
