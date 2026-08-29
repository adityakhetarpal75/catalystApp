import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  articles,
  beautyProducts,
  brandLogos,
  creators,
  trendingCreators,
} from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

const filters = ['Trending', 'Watch', 'Read', 'Explore Brands'];

export default function Discover() {
  const router = useRouter();
  const [filter, setFilter] = useState('Trending');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Discover</Text>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.onDarkText} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.onDarkFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.onDarkFaint}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((f) => (
            <Pressable
              key={f}
              style={[styles.pill, filter === f && styles.pillActive]}
              onPress={() => (f === 'Explore Brands' ? router.push('/discover/brands') : setFilter(f))}
            >
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending now — videos */}
        <SectionHeader title="Trending now" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {trendingCreators.map((handle, i) => (
            <Pressable key={i} style={styles.videoCard} onPress={() => router.push('/discover/creator')}>
              <View style={styles.videoThumb}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={16} color={colors.white} />
                </View>
              </View>
              <Text style={styles.videoHandle} numberOfLines={1}>
                {handle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Articles */}
        <SectionHeader title="Articles" action="Read all" onAction={() => router.push('/discover/article')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {articles.map((a) => (
            <Pressable
              key={a.id}
              style={styles.articleCard}
              onPress={() => router.push({ pathname: '/discover/article', params: { id: a.id } })}
            >
              <View style={styles.articleImg}>
                <Ionicons name="newspaper-outline" size={26} color={colors.onDarkFaint} />
              </View>
              <Text style={styles.articleTitle} numberOfLines={1}>
                {a.title}
              </Text>
              <Text style={styles.articleMeta} numberOfLines={1}>
                By {a.author}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Creators */}
        <SectionHeader title="Creators" action="See all" onAction={() => router.push('/discover/creator')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {creators.map((c) => (
            <Pressable key={c.id} style={styles.creatorCard} onPress={() => router.push('/discover/creator')}>
              <View style={styles.creatorHead}>
                <View style={styles.creatorAvatar}>
                  <Ionicons name="person" size={22} color={colors.onDarkFaint} />
                </View>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>{c.match}% match</Text>
                </View>
              </View>
              <Text style={styles.creatorHandle} numberOfLines={1}>
                {c.handle}
              </Text>
              <View style={styles.creatorTags}>
                {c.tags.map((t, i) => (
                  <View key={i} style={styles.creatorTag}>
                    <Text style={styles.creatorTagText}>{t}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.creatorShelf}>{c.products} products on the shelf</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Popular brands */}
        <SectionHeader title="Popular Brands" action="Explore" onAction={() => router.push('/discover/brands')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {brandLogos.slice(0, 6).map((b) => (
            <Pressable key={b} style={styles.brandChip} onPress={() => router.push({ pathname: '/discover/brand', params: { name: b } })}>
              <Text style={styles.brandChipText}>{b}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending products */}
        <SectionHeader title="Trending product list" />
        <View style={styles.productList}>
          {beautyProducts.map((p) => (
            <View key={p.id} style={styles.productRow}>
              <View style={styles.productImg}>
                <Ionicons name="cube-outline" size={22} color={colors.onDarkFaint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.productBrand}>{p.brand}</Text>
                <Text style={styles.productName}>{p.name}</Text>
              </View>
              <Text style={styles.productPrice}>${p.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  pageTitle: { ...font.h2, color: colors.onDarkText },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    backgroundColor: colors.darkElevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...font.body, color: colors.onDarkText },
  filters: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.darkElevated,
    marginRight: spacing.sm,
  },
  pillActive: { backgroundColor: colors.coral },
  pillText: { ...font.small, color: colors.onDarkFaint, fontWeight: '600' },
  pillTextActive: { color: colors.white },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...font.h3, color: colors.onDarkText },
  sectionAction: { ...font.small, color: colors.coral, fontWeight: '700' },
  hList: { paddingHorizontal: spacing.xl, gap: spacing.md },
  videoCard: { width: 120, marginRight: spacing.md },
  videoThumb: {
    width: 120,
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoHandle: { ...font.tiny, color: colors.onDarkMuted, marginTop: spacing.sm },
  articleCard: { width: 200, marginRight: spacing.md },
  articleImg: {
    width: 200,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleTitle: { ...font.bodyStrong, color: colors.onDarkText, marginTop: spacing.sm },
  articleMeta: { ...font.tiny, color: colors.onDarkFaint, marginTop: 2 },
  creatorCard: {
    width: 200,
    backgroundColor: colors.darkSurface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  creatorHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBadge: { backgroundColor: colors.coral, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  matchBadgeText: { ...font.tiny, color: colors.white, fontWeight: '700' },
  creatorHandle: { ...font.bodyStrong, color: colors.onDarkText, marginTop: spacing.sm },
  creatorTags: { flexDirection: 'row', gap: 6, marginTop: spacing.sm },
  creatorTag: { backgroundColor: colors.darkElevated, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  creatorTagText: { ...font.tiny, color: colors.onDarkMuted },
  creatorShelf: { ...font.tiny, color: colors.onDarkFaint, marginTop: spacing.md },
  brandChip: {
    paddingHorizontal: spacing.lg,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  brandChipText: { ...font.bodyStrong, color: colors.ink },
  productList: { paddingHorizontal: spacing.xl, gap: spacing.md },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  productImg: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productBrand: { ...font.tiny, color: colors.onDarkFaint, fontWeight: '700', textTransform: 'uppercase' },
  productName: { ...font.bodyStrong, color: colors.onDarkText, marginTop: 2 },
  productPrice: { ...font.bodyStrong, color: colors.onDarkText },
});
