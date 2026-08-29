import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { ImageTile } from '../../components/ui';
import { beautyProducts, closetItems } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

const catalog = [
  ...beautyProducts.map((b) => ({ id: b.id, brand: b.brand, name: b.name, category: 'Beauty' })),
  ...closetItems.map((c) => ({ id: `c-${c.id}`, brand: c.brand, name: c.name, category: c.category })),
];

export default function AddProducts() {
  const router = useRouter();
  const { composeProducts, setComposeProducts } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(composeProducts.map((p) => p.id));

  const results = useMemo(
    () =>
      catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onAdd = () => {
    const products = catalog
      .filter((p) => selected.includes(p.id))
      .map((p) => ({ id: p.id, brand: p.brand, name: p.name }));
    setComposeProducts(products);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Add Products" />
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Product name"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {results.map((p) => {
          const active = selected.includes(p.id);
          return (
            <Pressable key={p.id} style={styles.row} onPress={() => toggle(p.id)}>
              <ImageTile size={56} icon="cube-outline" />
              <View style={styles.info}>
                <Text style={styles.brand}>{p.brand}</Text>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.category}>{p.category}</Text>
              </View>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={active ? colors.ink : colors.borderStrong}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={
            selected.length
              ? `Add ${selected.length} product${selected.length > 1 ? 's' : ''}`
              : 'Add'
          }
          disabled={selected.length === 0}
          onPress={onAdd}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...font.body, color: colors.text },
  scroll: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  info: { flex: 1 },
  brand: {
    ...font.tiny,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  name: { ...font.bodyStrong, color: colors.text, marginTop: 1 },
  category: { ...font.tiny, color: colors.textFaint, marginTop: 1 },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
