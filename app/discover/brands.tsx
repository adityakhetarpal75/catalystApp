import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { brandLogos } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function ExploreBrands() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const list = useMemo(
    () => brandLogos.filter((b) => b.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.onDarkText} />
        </Pressable>
        <Text style={styles.title}>Explore Brands</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.onDarkFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands"
          placeholderTextColor={colors.onDarkFaint}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.onDarkFaint} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {list.map((b) => (
            <Pressable
              key={b}
              style={styles.tile}
              onPress={() => router.push({ pathname: '/discover/brand', params: { name: b } })}
            >
              <Text style={styles.tileText}>{b}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...font.h3, color: colors.onDarkText },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.darkElevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...font.body, color: colors.onDarkText },
  scroll: { padding: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
  },
  tileText: { ...font.small, color: colors.ink, fontWeight: '700', textAlign: 'center' },
});
