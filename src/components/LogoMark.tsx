import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';

type LogoMarkProps = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
};

const logoSources = {
  light: {
    full: require('../../assets/logo/golearrn-logo.png'),
    icon: require('../../assets/logo/golearrn-icon.png'),
  },
  dark: {
    full: require('../../assets/logo/golearrn-logo-white.png'),
    icon: require('../../assets/logo/golearrn-icon-white.png'),
  },
} as const;

const sizes = {
  sm: 44,
  md: 60,
  lg: 84,
} as const;

export function LogoMark({
  variant = 'light',
  size = 'md',
  showWordmark = true,
}: LogoMarkProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const source = logoSources[variant][showWordmark ? 'full' : 'icon'];

  if (!imageFailed) {
    return (
      <Image
        source={source}
        onError={() => setImageFailed(true)}
        resizeMode="contain"
        style={[
          showWordmark ? styles.fullLogo : styles.iconLogo,
          imageSizes[size][showWordmark ? 'full' : 'icon'],
        ]}
      />
    );
  }

  const dimension = sizes[size];
  const isDark = variant === 'dark';

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 3,
            backgroundColor: isDark ? COLORS.white : COLORS.darkNavy,
          },
        ]}
      >
        <View
          style={[
            styles.innerRing,
            {
              borderColor: isDark ? COLORS.primaryBlue : COLORS.primaryCyan,
              width: dimension * 0.58,
              height: dimension * 0.58,
              borderRadius: dimension * 0.29,
            },
          ]}
        />
        <View
          style={[
            styles.centerDot,
            {
              backgroundColor: isDark ? COLORS.primaryBlue : COLORS.primaryCyan,
              width: dimension * 0.17,
              height: dimension * 0.17,
              borderRadius: dimension * 0.085,
            },
          ]}
        />
      </View>
      {showWordmark ? (
        <View style={styles.wordmark}>
          <Text style={[styles.brand, { color: isDark ? COLORS.white : COLORS.primaryText }]}>
            GOLEARRN
          </Text>
          <Text
            style={[styles.subBrand, { color: isDark ? COLORS.onDarkMuted : COLORS.secondaryText }]}
          >
            Learn. Upskill. Grow.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function LogoAsset({
  source,
  size = 88,
}: {
  source: ImageSourcePropType;
  size?: number;
}) {
  return <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />;
}

const imageSizes = {
  sm: {
    full: { width: 150, height: 36 },
    icon: { width: 42, height: 42 },
  },
  md: {
    full: { width: 208, height: 50 },
    icon: { width: 56, height: 56 },
  },
  lg: {
    full: { width: 272, height: 66 },
    icon: { width: 78, height: 78 },
  },
} as const;

const styles = StyleSheet.create({
  fullLogo: {
    alignSelf: 'flex-start',
  },
  iconLogo: {
    alignSelf: 'flex-start',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  innerRing: {
    borderWidth: 3,
    position: 'absolute',
  },
  centerDot: {
    position: 'absolute',
  },
  wordmark: {
    gap: SPACING.xxs,
  },
  brand: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subBrand: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});
