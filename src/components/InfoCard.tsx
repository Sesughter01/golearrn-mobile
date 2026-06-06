import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../constants/theme';

type InfoCardProps = {
  title: string;
  description: string;
  footer?: ReactNode;
  accent?: 'default' | 'soft';
};

export function InfoCard({
  title,
  description,
  footer,
  accent = 'default',
}: InfoCardProps) {
  return (
    <View style={[styles.card, accent === 'soft' && styles.softCard]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  softCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.primarySoft,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    marginTop: spacing.xs,
  },
});
