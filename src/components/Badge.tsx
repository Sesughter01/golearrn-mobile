import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../constants/theme';
import { CourseTranslationState } from '../types/course';

type BadgeTone = 'blue' | 'green' | 'amber' | 'red' | 'slate';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  blue: { backgroundColor: colors.primarySoft, color: colors.primaryDark },
  green: { backgroundColor: '#DEF7E5', color: colors.success },
  amber: { backgroundColor: '#FEEBC8', color: colors.warning },
  red: { backgroundColor: '#FED7D7', color: colors.danger },
  slate: { backgroundColor: '#E2E8F0', color: colors.textMuted },
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
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
