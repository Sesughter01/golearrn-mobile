import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';

export function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.card}>
      <ActivityIndicator color={COLORS.primaryBlue} size="small" />
      <Text style={styles.label}>{label}</Text>
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
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  label: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});
