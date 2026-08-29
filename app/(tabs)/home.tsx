import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/ProductCard';
import { Avatar, SectionTitle } from '../../components/ui';
import { closetItems, thrifters } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, radius, spacing } from '../../constants/theme';

const categories = ['All', 'Dresses', 'Denim', 'Vintage', 'Outerwear', 'Shoes', 'Bags'];

export default function Home() {
  const router = useRouter();
  const { profile, wishlist, toggleWishlist } = useApp();
  const { user } = useAuth();
  const recommended = closetItems.slice(0, 6);
  const trending = closetItems.slice(2, 8);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.hello}>Hi {profile.firstName || user?.firstName || 'there'} 👋</Text>
          <Text style={styles.subHello}>Find your next favourite piece</Text>
        </View>
        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.dot} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textFaint} />
            <Text style={styles.searchText}>Search brands, styles, members…</Text>
          </View>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((c, i) => (
            <Pressable key={c} style={[styles.pill, i === 0 && styles.pillActive]}>
              <Text style={[styles.pillText, i === 0 && styles.pillTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable style={styles.hero} onPress={() => router.push('/(tabs)/discover')}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>THIS WEEK</Text>
            <Text style={styles.heroTitle}>Vintage drop{'\n'}from your city</Text>
            <View style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Shop now</Text>
            </View>
          </View>
          <Ionicons name="sparkles" size={64} color="rgba(255,255,255,0.15)" style={styles.heroIcon} />
        </Pressable>

        <View style={styles.section}>
          <SectionTitle title="Recommended for you" action="See all" onAction={() => router.push('/(tabs)/discover')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommended.map((item) => (
              <View key={item.id} style={{ width: 150, marginRight: spacing.md }}>
                <ProductCard
                  item={item}
                  width="100%"
                  wishlisted={!!wishlist.find((w) => w.id === item.id)}
                  onWishlist={() => toggleWishlist(item)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Thrifters near you" action="See all" onAction={() => router.push('/(tabs)/discover')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {thrifters.map((t) => (
              <View key={t.handle} style={styles.thrifter}>
                <Avatar name={t.handle.replace('@', '')} size={64} ring />
                <Text style={styles.thrifterName} numberOfLines={1}>
                  {t.handle}
                </Text>
                <Text style={styles.thrifterMatch}>{t.match}% match</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Trending in your city" action="See all" onAction={() => router.push('/(tabs)/discover')} />
          <View style={styles.grid}>
            {trending.map((item) => (
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  hello: { ...font.h2, color: colors.text },
  subHello: { ...font.small, color: colors.textMuted, marginTop: 2 },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { position: 'absolute', top: 11, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  searchWrap: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.md, marginBottom: spacing.md },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
  },
  searchText: { ...font.body, color: colors.textFaint },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: { paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  pillActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillText: { ...font.small, color: colors.textMuted, fontWeight: '600' },
  pillTextActive: { color: colors.white },
  hero: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    height: 160,
    borderRadius: radius.xl,
    backgroundColor: colors.slate,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  heroContent: { padding: spacing.xl },
  heroTag: { ...font.label, color: colors.onDarkMuted, marginBottom: spacing.sm },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.white, lineHeight: 28 },
  heroBtn: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  heroBtnText: { ...font.small, color: colors.ink, fontWeight: '700' },
  heroIcon: { position: 'absolute', right: 16, bottom: 8 },
  section: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
  thrifter: { width: 84, alignItems: 'center', marginRight: spacing.md },
  thrifterName: { ...font.tiny, color: colors.text, fontWeight: '600', marginTop: spacing.sm },
  thrifterMatch: { ...font.tiny, color: colors.success, fontWeight: '700', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%' },
});
