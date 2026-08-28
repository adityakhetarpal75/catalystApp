import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/ProductCard';
import { Avatar } from '../../components/ui';
import { closetItems, thrifters } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

const filters = ['All', 'For Sale', 'For Rent', 'Vintage', 'Denim', 'Dresses'];

export default function Discover() {
  const { wishlist, toggleWishlist } = useApp();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'items' | 'people'>('items');
  const [filter, setFilter] = useState('All');

  const results = useMemo(() => {
    let list = closetItems;
    if (filter === 'For Rent') list = list.filter((i) => i.forRent);
    if (filter === 'For Sale') list = list.filter((i) => !i.forRent);
    if (filter === 'Denim') list = list.filter((i) => i.material === 'Denim');
    if (filter === 'Dresses') list = list.filter((i) => i.category === 'Dresses');
    if (filter === 'Vintage') list = list.filter((i) => i.tags?.includes('Vintage') || i.tags?.includes('90s'));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands, styles, members…"
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

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, tab === 'items' && styles.tabActive]} onPress={() => setTab('items')}>
          <Text style={[styles.tabText, tab === 'items' && styles.tabTextActive]}>Items</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'people' && styles.tabActive]} onPress={() => setTab('people')}>
          <Text style={[styles.tabText, tab === 'people' && styles.tabTextActive]}>People</Text>
        </Pressable>
      </View>

      {tab === 'items' ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {filters.map((f) => (
              <Pressable
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.grid}>
              {results.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductCard
                    item={item}
                    width="100%"
                    wishlisted={!!wishlist.find((w) => w.id === item.id)}
                    onWishlist={() => toggleWishlist(item)}
                  />
                </View>
              ))}
            </View>
            {results.length === 0 ? (
              <Text style={styles.empty}>No items match your search.</Text>
            ) : null}
          </ScrollView>
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: spacing.xl }}>
          {thrifters.map((t) => (
            <View key={t.handle} style={styles.personRow}>
              <Avatar name={t.handle.replace('@', '')} size={52} />
              <View style={styles.personInfo}>
                <Text style={styles.personHandle}>{t.handle}</Text>
                <Text style={styles.personBio} numberOfLines={1}>{t.bio}</Text>
                <Text style={styles.personMatch}>{t.match}% match</Text>
              </View>
              <Pressable style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  headerRow: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  title: { ...font.h2, color: colors.text },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...font.body, color: colors.text },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.xl, marginTop: spacing.lg, gap: spacing.xl },
  tab: { paddingBottom: spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.ink },
  tabText: { ...font.title, color: colors.textFaint },
  tabTextActive: { color: colors.text },
  filters: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { ...font.small, color: colors.textMuted, fontWeight: '600' },
  filterTextActive: { color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.xl },
  gridItem: { width: '48%' },
  empty: { ...font.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxxl },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  personInfo: { flex: 1, marginLeft: spacing.md },
  personHandle: { ...font.bodyStrong, color: colors.text },
  personBio: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  personMatch: { ...font.tiny, color: colors.success, fontWeight: '700', marginTop: 4 },
  followBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.ink },
  followText: { ...font.small, color: colors.white, fontWeight: '700' },
});
