import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { ImageTile } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function CreateLook() {
  const router = useRouter();
  const { items, addLook } = useApp();
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const canSave = title.trim().length > 0 && selected.length > 0;

  return (
    <Screen scroll>
      <Header title="Create a Look" />
      <Text style={styles.label}>Look title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Fall layering"
        placeholderTextColor={colors.textFaint}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { marginTop: spacing.xl }]}>Pick items from your closet</Text>
      <View style={styles.grid}>
        {items.map((item) => {
          const active = selected.includes(item.id);
          return (
            <Pressable key={item.id} style={styles.tile} onPress={() => toggle(item.id)}>
              <ImageTile aspectRatio={1} icon="shirt-outline" style={{ width: '100%' }} />
              {active ? (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
              ) : null}
              <Text style={styles.tileLabel} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Save Look"
        disabled={!canSave}
        onPress={() => {
          addLook({
            id: String(Date.now()),
            title: title.trim(),
            itemCount: selected.length,
          });
          router.back();
        }}
        style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...font.label, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    ...font.body,
    color: colors.text,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '31%', marginBottom: spacing.lg, position: 'relative' },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { ...font.tiny, color: colors.textMuted, marginTop: 4 },
});
