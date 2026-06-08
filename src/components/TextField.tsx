import { StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS, FONT_SIZES, LAYOUT, RADIUS, SPACING } from '../constants/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
}: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.secondaryText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACING.xs,
  },
  label: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.md,
    minHeight: LAYOUT.touchTarget,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
});
