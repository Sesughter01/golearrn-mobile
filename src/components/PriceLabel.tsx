import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../constants/theme';

export function PriceLabel({
  label,
  isFree,
}: {
  label: string;
  isFree?: boolean;
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isFree ? COLORS.successSoft : COLORS.navySoft },
      ]}
    >
      <Text style={[styles.label, { color: isFree ? COLORS.primaryCyan : COLORS.primaryText }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
  },
});
