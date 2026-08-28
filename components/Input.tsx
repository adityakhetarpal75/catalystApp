import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  hint?: string;
}

export function Input({ label, icon, containerStyle, hint, style, ...props }: InputProps) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        {icon ? (
          <Ionicons name={icon} size={18} color={colors.textFaint} style={styles.icon} />
        ) : null}
        <TextInput
          placeholderTextColor={colors.textFaint}
          style={[styles.input, style]}
          {...props}
        />
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: {
    ...font.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  icon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    ...font.body,
    color: colors.text,
    height: '100%',
  },
  hint: {
    ...font.small,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
});
