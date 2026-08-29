import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onChange?: (value: string) => void;
  searchable?: boolean;
}

export function SelectField({
  label,
  placeholder = 'Select',
  value,
  options,
  onChange,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Ionicons name="search" size={16} color={colors.textFaint} style={styles.icon} />
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {label ? <Text style={styles.sheetTitle}>{label}</Text> : null}
            <ScrollView style={{ maxHeight: 320 }}>
              {options.map((opt) => {
                const active = opt === value;
                return (
                  <Pressable
                    key={opt}
                    style={styles.option}
                    onPress={() => {
                      onChange?.(opt);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, active && styles.optionActive]}>{opt}</Text>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color={colors.ink} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
  value: { flex: 1, ...font.body, color: colors.text },
  placeholder: { color: colors.textFaint },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.floating,
  },
  sheetTitle: { ...font.h3, color: colors.text, marginBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionText: { ...font.body, color: colors.text },
  optionActive: { fontWeight: '700' },
});
