import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, LAYOUT, SPACING } from '../constants/theme';

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
    backgroundColor: COLORS.lightBackground,
  },
  content: {
    alignSelf: 'center',
    gap: SPACING.lg,
    maxWidth: LAYOUT.screenMaxWidth,
    padding: SPACING.lg,
    width: LAYOUT.contentWidth,
  },
  header: {
    gap: SPACING.xs,
    paddingTop: SPACING.md,
  },
  eyebrow: {
    color: COLORS.primaryBlue,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  body: {
    gap: SPACING.md,
  },
});
