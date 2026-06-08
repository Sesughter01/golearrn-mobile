import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { LogoMark } from './LogoMark';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  imageSource,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSource?: ImageSourcePropType;
}) {
  return (
    <View style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      ) : (
        <LogoMark size="sm" showWordmark={false} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.lg,
    ...SHADOWS.soft,
  },
  image: {
    height: 128,
    maxWidth: 220,
    width: '100%',
  },
  title: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
    textAlign: 'center',
  },
});
