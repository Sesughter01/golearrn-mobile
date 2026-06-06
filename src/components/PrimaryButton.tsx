import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing } from '../constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  fullWidth = true,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.pill,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },
});
