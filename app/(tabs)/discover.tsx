import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  articles,
  beautyProducts,
  brandLogos,
  creators,
  trendingCreators,
  watchVideos,
} from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

const filters = ['Trending', 'Watch', 'Read', 'Explore Brands'] as const;
type Filter = (typeof filters)[number];

export default function Discover() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('Trending');
  const [query, setQuery] = useState('');
  const featured = creators[0];
  const featuredProduct = beautyProducts[0];

  const filteredBrands = useMemo(
    () => brandLogos.filter((b) => b.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
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
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close" size={18} color={colors.onDarkFaint} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filters.map((f) => (
            <Pressable
              key={f}
              style={[styles.pill, filter === f && styles.pillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {filter === 'Trending' ? (
          <TrendingContent
            featured={featured}
            featuredProduct={featuredProduct}
            onArticle={(id) =>
              router.push({ pathname: '/discover/article', params: { id } })
            }
            onCreator={() => router.push('/discover/creator')}
            onBrand={(name) =>
              router.push({ pathname: '/discover/brand', params: { name } })
            }
            onExploreBrands={() => setFilter('Explore Brands')}
            onReadAll={() => setFilter('Read')}
          />
        ) : null}

        {filter === 'Watch' ? (
          <WatchContent onCreator={() => router.push('/discover/creator')} />
        ) : null}

        {filter === 'Read' ? (
          <ReadContent
            onArticle={(id) =>
              router.push({ pathname: '/discover/article', params: { id } })
            }
          />
        ) : null}

        {filter === 'Explore Brands' ? (
          <BrandsContent
            brands={filteredBrands}
            onBrand={(name) =>
              router.push({ pathname: '/discover/brand', params: { name } })
            }
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function TrendingContent({
  featured,
  featuredProduct,
  onArticle,
  onCreator,
  onBrand,
  onExploreBrands,
  onReadAll,
}: {
  featured: (typeof creators)[0];
  featuredProduct: (typeof beautyProducts)[0];
  onArticle: (id: string) => void;
  onCreator: () => void;
  onBrand: (name: string) => void;
  onExploreBrands: () => void;
  onReadAll: () => void;
}) {
  return (
    <>
      <SectionHeader title="Trending now" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {trendingCreators.map((handle, i) => (
          <Pressable key={i} style={styles.videoCard} onPress={onCreator}>
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

      <SectionHeader title="Articles" action="Read all" onAction={onReadAll} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {articles.map((a) => (
          <Pressable key={a.id} style={styles.articleCard} onPress={() => onArticle(a.id)}>
            <View style={styles.articleImg}>
              <Ionicons name="newspaper-outline" size={26} color={colors.onDarkFaint} />
            </View>
            <Text style={styles.articleTitleCoral} numberOfLines={1}>
              {a.title}
            </Text>
            <Text style={styles.articleMeta} numberOfLines={2}>
              BY {a.author.toUpperCase()}
            </Text>
            <Text style={styles.articleDate}>{a.date}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="Featured creator" />
      <Pressable style={styles.featuredCard} onPress={onCreator}>
        <View style={styles.featuredTop}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{featured.match}% match</Text>
          </View>
        </View>
        <View style={styles.featuredRow}>
          <View style={styles.creatorAvatarLg}>
            <Ionicons name="person" size={28} color={colors.onDarkFaint} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.creatorHandle}>{featured.handle}</Text>
            <View style={styles.creatorTags}>
              {featured.tags.map((t) => (
                <View key={t} style={styles.creatorTagCoral}>
                  <Text style={styles.creatorTagCoralText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.creatorShelf}>{featured.products} products on the shelf</Text>
        <View style={styles.featuredProduct}>
          <View style={styles.featuredProductImg}>
            <Ionicons name="cube-outline" size={20} color={colors.onDarkFaint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.productBrand}>{featuredProduct.brand}</Text>
            <Text style={styles.productName}>{featuredProduct.name}</Text>
          </View>
          <Text style={styles.productPrice}>${featuredProduct.price}</Text>
        </View>
      </Pressable>

      <SectionHeader title="Popular Brands" action="Explore" onAction={onExploreBrands} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {brandLogos.slice(0, 8).map((b) => (
          <Pressable key={b} style={styles.brandTile} onPress={() => onBrand(b)}>
            <Text style={styles.brandTileText}>{b}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="Trending product list" />
      <View style={styles.productList}>
        {beautyProducts.slice(0, 5).map((p) => (
          <Pressable key={p.id} style={styles.productRow} onPress={() => onBrand(p.brand)}>
            <View style={styles.productImg}>
              <Ionicons name="cube-outline" size={22} color={colors.onDarkFaint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productBrand}>{p.brand}</Text>
              <Text style={styles.productName}>{p.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onDarkFaint} />
          </Pressable>
        ))}
      </View>
    </>
  );
}

function WatchContent({ onCreator }: { onCreator: () => void }) {
  return (
    <>
      <SectionHeader title="Watch" />
      <View style={styles.watchGrid}>
        {watchVideos.map((v) => (
          <Pressable key={v.id} style={styles.watchCard} onPress={onCreator}>
            <View style={styles.watchThumb}>
              <View style={styles.playBtn}>
                <Ionicons name="play" size={18} color={colors.white} />
              </View>
            </View>
            <Text style={styles.watchTitle} numberOfLines={2}>
              {v.title}
            </Text>
            <Text style={styles.videoHandle} numberOfLines={1}>
              {v.handle}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function ReadContent({ onArticle }: { onArticle: (id: string) => void }) {
  return (
    <>
      <SectionHeader title="Recently published" />
      <View style={styles.readList}>
        {articles.map((a) => (
          <Pressable key={a.id} style={styles.readCard} onPress={() => onArticle(a.id)}>
            <View style={styles.readImg}>
              <Ionicons name="image-outline" size={32} color={colors.onDarkFaint} />
            </View>
            <Text style={styles.articleTitleCoral}>{a.title}</Text>
            <Text style={styles.articleMeta}>
              BY {a.author.toUpperCase()}, {a.date}
            </Text>
            <Text style={styles.readSnippet} numberOfLines={3}>
              {a.header}. There is an abundance of brands, blogs, and retailers constantly shelling
              out education and the latest news…
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function BrandsContent({
  brands,
  onBrand,
}: {
  brands: string[];
  onBrand: (name: string) => void;
}) {
  return (
    <>
      <SectionHeader title="Popular Brands" />
      <View style={styles.brandGrid}>
        {brands.map((b) => (
          <Pressable key={b} style={styles.brandGridTile} onPress={() => onBrand(b)}>
            <Text style={styles.brandTileText}>{b}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
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
    paddingVertical: spacing.sm + 2,
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
  hList: { paddingHorizontal: spacing.xl },
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoHandle: { ...font.tiny, color: colors.onDarkMuted, marginTop: spacing.sm },
  articleCard: { width: 200, marginRight: spacing.md },
  articleImg: {
    width: 200,
    height: 130,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleTitleCoral: {
    ...font.bodyStrong,
    color: colors.coral,
    marginTop: spacing.sm,
  },
  articleMeta: { ...font.tiny, color: colors.onDarkFaint, marginTop: 4, fontWeight: '700' },
  articleDate: { ...font.tiny, color: colors.onDarkFaint, marginTop: 2 },
  featuredCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.darkSurface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  featuredTop: { alignItems: 'flex-start', marginBottom: spacing.md },
  matchBadge: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  matchBadgeText: { ...font.tiny, color: colors.white, fontWeight: '800' },
  featuredRow: { flexDirection: 'row', alignItems: 'center' },
  creatorAvatarLg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorHandle: { ...font.bodyStrong, color: colors.onDarkText },
  creatorTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  creatorTagCoral: {
    backgroundColor: 'rgba(255,107,94,0.18)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  creatorTagCoralText: { ...font.tiny, color: colors.coral, fontWeight: '700' },
  creatorShelf: { ...font.small, color: colors.onDarkMuted, marginTop: spacing.md },
  featuredProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.darkElevated,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  featuredProductImg: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTile: {
    width: 92,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    padding: spacing.sm,
  },
  brandTileText: { ...font.small, color: colors.ink, fontWeight: '800', textAlign: 'center' },
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
  productBrand: {
    ...font.tiny,
    color: colors.onDarkFaint,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productName: { ...font.bodyStrong, color: colors.onDarkText, marginTop: 2 },
  productPrice: { ...font.bodyStrong, color: colors.onDarkText },
  watchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  watchCard: { width: '48%', marginBottom: spacing.lg },
  watchThumb: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchTitle: { ...font.small, color: colors.onDarkText, fontWeight: '600', marginTop: spacing.sm },
  readList: { paddingHorizontal: spacing.xl, gap: spacing.lg },
  readCard: { marginBottom: spacing.sm },
  readImg: {
    width: '100%',
    height: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readSnippet: {
    ...font.small,
    color: colors.onDarkMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  brandGridTile: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
  },
});
