import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../constants/theme';
import { CourseTranslationState } from '../types/course';

type BadgeTone = 'blue' | 'green' | 'amber' | 'red' | 'slate';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  blue: { backgroundColor: COLORS.successSoft, color: COLORS.primaryBlue },
  green: { backgroundColor: COLORS.successSoft, color: COLORS.primaryCyan },
  amber: { backgroundColor: COLORS.warningSoft, color: COLORS.ratingGold },
  red: { backgroundColor: COLORS.errorSoft, color: COLORS.error },
  slate: { backgroundColor: COLORS.navySoft, color: COLORS.secondaryText },
};

export function Badge({ label, tone = 'blue' }: BadgeProps) {
  const palette = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.backgroundColor }]}>
      <Text style={[styles.label, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

export function getTranslationTone(state: CourseTranslationState): BadgeTone {
  switch (state) {
    case 'translated':
      return 'green';
    case 'partial':
      return 'blue';
    case 'pending':
      return 'amber';
    case 'failed':
      return 'red';
    case 'original':
      return 'slate';
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
});
