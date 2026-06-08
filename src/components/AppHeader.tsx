import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { LogoMark } from './LogoMark';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  logoVariant?: 'light' | 'dark';
  compactLogo?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  logoVariant = 'light',
  compactLogo = true,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <LogoMark size="sm" variant={logoVariant} showWordmark={!compactLogo} />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.md,
    minHeight: 84,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  copy: {
    flex: 1,
    gap: SPACING.xxs,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
