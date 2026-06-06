import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';

type ScreenContainerProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function ScreenContainer({
  eyebrow,
  title,
  subtitle,
  children,
}: ScreenContainerProps) {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    gap: spacing.md,
  },
});
