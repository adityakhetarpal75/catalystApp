import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { beautyProducts } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function BrandDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const brand = name || 'Murad';
  const [following, setFollowing] = useState(false);

  const products = useMemo(() => {
    const matched = beautyProducts.filter(
      (p) => p.brand.toLowerCase() === brand.toLowerCase()
    );
    return matched.length ? matched : beautyProducts;
  }, [brand]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.bannerBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
            <View style={styles.bannerActions}>
              <Pressable style={styles.bannerBtn}>
                <Ionicons name="search" size={18} color={colors.white} />
              </Pressable>
              <Pressable style={styles.bannerBtn}>
                <Ionicons name="settings-outline" size={18} color={colors.white} />
              </Pressable>
            </View>
          </View>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{brand.slice(0, 1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.brandName}>{brand}</Text>
          <Pressable
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={() => setFollowing((v) => !v)}
          >
            <Text style={[styles.followText, following && styles.followingText]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Top Products</Text>
          <View style={styles.grid}>
            {products.map((p) => (
              <View key={p.id} style={styles.card}>
                <View style={styles.cardImg}>
                  <Ionicons name="cube-outline" size={26} color={colors.onDarkFaint} />
                </View>
                <Text style={styles.cardBrand}>{p.brand}</Text>
                <Text style={styles.cardName} numberOfLines={2}>
                  {p.name}
                </Text>
                <Text style={styles.cardPrice}>
                  ${p.price}
                  {p.points ? ` + ${p.points} pts` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  banner: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 48,
  },
  bannerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerActions: { flexDirection: 'row', gap: spacing.sm },
  bannerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', marginTop: spacing.xxl },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.dark,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: colors.ink },
  body: { paddingHorizontal: spacing.xl, marginTop: -28 },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.onDarkText,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  followBtn: {
    alignSelf: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  followingBtn: { backgroundColor: colors.coral },
  followText: { ...font.small, color: colors.ink, fontWeight: '700' },
  followingText: { color: colors.white },
  sectionTitle: {
    ...font.h3,
    color: colors.onDarkText,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: { width: '48%', marginBottom: spacing.lg },
  cardImg: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardBrand: {
    ...font.tiny,
    color: colors.onDarkFaint,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardName: { ...font.small, color: colors.onDarkText, fontWeight: '600', marginTop: 2, minHeight: 32 },
  cardPrice: { ...font.small, color: colors.onDarkMuted, marginTop: 2 },
});
