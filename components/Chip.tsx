import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Full-width stacked pills (Figma thrifting goals) */
  block?: boolean;
}

export function Chip({ label, selected, onPress, block }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, block && styles.block, selected && styles.chipSelected]}
      accessibilityRole="button"
    >
      {selected ? (
        <Ionicons name="checkmark" size={16} color={colors.white} style={styles.icon} />
      ) : (
        <Ionicons name="ellipse-outline" size={16} color={colors.borderStrong} style={styles.icon} />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  block: {
    alignSelf: 'stretch',
    marginRight: 0,
    borderRadius: radius.lg,
  },
  chipSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  icon: { marginRight: spacing.sm },
  label: { ...font.body, color: colors.text, fontWeight: '500', flexShrink: 1 },
  labelSelected: { color: colors.white, fontWeight: '600' },
});
