import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface CheckRowProps {
  label: string;
  checked?: boolean;
  onPress?: () => void;
}

export function CheckRow({ label, checked, onPress }: CheckRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, checked && styles.rowChecked]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  // Figma selected state: soft slate fill
  rowChecked: { borderColor: '#C5CDD6', backgroundColor: '#E8EEF2' },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.ink, borderColor: colors.ink },
  label: { ...font.body, color: colors.text },
});
