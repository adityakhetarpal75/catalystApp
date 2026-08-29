import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ProductCard } from '../../components/ProductCard';
import { Avatar, ImageTile, SectionTitle, Tag } from '../../components/ui';
import {
  ClosetItem,
  rentCategoryPlaceholders,
  sellCategoryPlaceholders,
} from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

type Segment = 'closet' | 'looks';

export default function Closet() {
  const router = useRouter();
  const {
    profile,
    items,
    wishlist,
    toggleWishlist,
    looks,
    sellEnabled,
    rentEnabled,
    closetIntroSeen,
    markClosetIntroSeen,
  } = useApp();
  const [segment, setSegment] = useState<Segment>('closet');
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!closetIntroSeen) setShowIntro(true);
  }, [closetIntroSeen]);

  const grouped = useMemo(() => {
    const forSale = items.filter((i) => !i.forRent);
    const forRent = items.filter((i) => i.forRent);
    const byCategory: Record<string, ClosetItem[]> = {};
    forSale.forEach((i) => {
      byCategory[i.category] = byCategory[i.category] || [];
      byCategory[i.category].push(i);
    });
    return { byCategory, forSale, forRent };
  }, [items]);

  const handle = profile.username ? `@${profile.username}` : '@you';
  const bio = profile.bio || 'Curating vintage finds & thrift gems.';
  const location = profile.location || 'San Francisco, CA';
  const badges = [
    sellEnabled || rentEnabled
      ? [rentEnabled && 'Rent', sellEnabled && 'Sell'].filter(Boolean).join(', ')
      : null,
    'Vintage Queen',
  ].filter(Boolean) as string[];

  const dismissIntro = () => {
    markClosetIntroSeen();
    setShowIntro(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Pressable style={styles.gear} onPress={() => router.push('/profile/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
          <Avatar name={profile.username || profile.firstName || 'You'} size={88} ring />
          <View style={styles.handleRow}>
            <Text style={styles.handle}>{handle}</Text>
            <Ionicons name="checkmark-circle" size={16} color={colors.ink} />
          </View>

          <View style={styles.stats}>
            <Stat value={String(items.length)} label="Items" />
            <View style={styles.statDivider} />
            <Stat value={String(looks.length)} label="Looks" />
            <View style={styles.statDivider} />
            <Stat value="18" label="Matches" />
          </View>

          <View style={styles.tagsRow}>
            {badges.map((b) => (
              <Tag key={b} label={b} dark />
            ))}
          </View>

          <Text style={styles.bio}>{bio}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        <View style={styles.segment}>
          <SegBtn
            active={segment === 'closet'}
            icon="grid-outline"
            label="My Closet"
            onPress={() => setSegment('closet')}
          />
          <SegBtn
            active={segment === 'looks'}
            icon="images-outline"
            label="My Looks"
            onPress={() => setSegment('looks')}
          />
        </View>

        {segment === 'closet' ? (
          <ClosetContent
            grouped={grouped}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onAdd={() => router.push('/closet/add-item')}
            onEdit={() => router.push('/closet/edit')}
            onWishlistAll={() => router.push('/profile/wishlist')}
          />
        ) : (
          <LooksContent
            looks={looks}
            onCreate={() => router.push('/closet/create-look')}
          />
        )}
      </ScrollView>

      <Modal visible={showIntro} animationType="slide" onRequestClose={dismissIntro}>
        <SafeAreaView style={styles.introRoot} edges={['top', 'bottom']}>
          <View style={styles.introHeader}>
            <Pressable onPress={dismissIntro} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.introTitle}>Closet</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.introBody}>
            <View style={styles.introMedia}>
              <Ionicons name="play-circle-outline" size={56} color={colors.textFaint} />
              <Text style={styles.introMediaText}>
                Walkthrough video or gif animation presenting main features
              </Text>
            </View>
          </View>
          <View style={styles.introFooter}>
            <Button label="Next" onPress={dismissIntro} />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SegBtn({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.segBtn, active && styles.segBtnActive]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={active ? colors.white : colors.textMuted} />
      <Text style={[styles.segText, active && styles.segTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ClosetContent({
  grouped,
  wishlist,
  toggleWishlist,
  onAdd,
  onEdit,
  onWishlistAll,
}: {
  grouped: { byCategory: Record<string, ClosetItem[]>; forSale: ClosetItem[]; forRent: ClosetItem[] };
  wishlist: ClosetItem[];
  toggleWishlist: (i: ClosetItem) => void;
  onAdd: () => void;
  onEdit: () => void;
  onWishlistAll: () => void;
}) {
  const categories = Object.keys(grouped.byCategory);
  const showEmptySellGrid = grouped.forSale.length === 0;

  return (
    <View style={styles.body}>
      <SectionTitle title="Wishlist" action="Edit" onAction={onWishlistAll} />
      {wishlist.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.xl }}>
          <View style={styles.wishRow}>
            {wishlist.map((item) => (
              <Pressable key={item.id} style={styles.wishlistCard} onPress={onWishlistAll}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.wishTitle}>{item.name}</Text>
                  <Text style={styles.wishMeta}>Size: {item.size}</Text>
                  <Text style={styles.wishBody} numberOfLines={2}>
                    {item.description ||
                      'Add inspo notes, quotes, or a short story about this piece.'}
                  </Text>
                  <View style={styles.wishTags}>
                    {(item.tags || ['Vintage']).slice(0, 3).map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </View>
                </View>
                <ImageTile size={72} icon="shirt-outline" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.addTile}>
          <Text style={styles.addTileLabel}>Add inspo pics of items that you are looking for</Text>
          <Pressable style={styles.addPill} onPress={onAdd}>
            <Text style={styles.addPillText}>Add Items</Text>
          </Pressable>
        </View>
      )}

      <View style={{ marginTop: spacing.xl }}>
        <SectionTitle title="Items to Sell" action="Edit" onAction={onEdit} />
        {showEmptySellGrid ? (
          <View style={styles.placeholderGrid}>
            {sellCategoryPlaceholders.map((cat) => (
              <Pressable key={cat} style={styles.placeholderTile} onPress={onAdd}>
                <Ionicons name="image-outline" size={22} color={colors.textFaint} />
                <Text style={styles.placeholderLabel}>{cat}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          categories.map((cat) => (
            <View key={cat} style={styles.categoryBlock}>
              <SectionTitle title={cat} action="Edit" onAction={onEdit} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {grouped.byCategory[cat].map((item) => (
                  <View key={item.id} style={{ width: 130, marginRight: spacing.md }}>
                    <ProductCard
                      item={item}
                      width="100%"
                      wishlisted={!!wishlist.find((w) => w.id === item.id)}
                      onWishlist={() => toggleWishlist(item)}
                    />
                  </View>
                ))}
                {/* Fill empty slots so rows look like Figma 3-up */}
                {grouped.byCategory[cat].length < 3
                  ? Array.from({ length: 3 - grouped.byCategory[cat].length }).map((_, i) => (
                      <Pressable key={`empty-${cat}-${i}`} style={styles.emptySlot} onPress={onAdd}>
                        <Ionicons name="add" size={22} color={colors.textFaint} />
                      </Pressable>
                    ))
                  : null}
              </ScrollView>
            </View>
          ))
        )}
      </View>

      <View style={styles.categoryBlock}>
        <SectionTitle title="Items to Rent" action="Edit" onAction={onEdit} />
        {grouped.forRent.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {grouped.forRent.map((item) => (
              <View key={item.id} style={{ width: 130, marginRight: spacing.md }}>
                <ProductCard
                  item={item}
                  width="100%"
                  wishlisted={!!wishlist.find((w) => w.id === item.id)}
                  onWishlist={() => toggleWishlist(item)}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {rentCategoryPlaceholders.map((label) => (
              <Pressable key={label} style={styles.rentPlaceholder} onPress={onAdd}>
                <Ionicons name="image-outline" size={22} color={colors.textFaint} />
                <Text style={styles.placeholderLabel}>{label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <Button
        label="+ Add item to closet"
        variant="secondary"
        onPress={onAdd}
        style={{ marginTop: spacing.xl }}
      />
    </View>
  );
}

function LooksContent({
  looks,
  onCreate,
}: {
  looks: { id: string; title: string; itemCount: number }[];
  onCreate: () => void;
}) {
  if (looks.length === 0) {
    return (
      <View style={styles.emptyLooks}>
        <View style={styles.emptyIcon}>
          <Ionicons name="images-outline" size={30} color={colors.textFaint} />
        </View>
        <Text style={styles.emptyTitle}>You don't have looks yet!</Text>
        <Text style={styles.emptySub}>
          Create looks to inspire the community & sell your items!
        </Text>
        <Button label="Create a look" onPress={onCreate} style={{ marginTop: spacing.xl }} fullWidth={false} />
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <Button
        label="+ Create a look"
        variant="secondary"
        onPress={onCreate}
        style={{ marginBottom: spacing.lg }}
      />
      <View style={styles.looksGrid}>
        {looks.map((look, i) => (
          <Pressable key={look.id} style={styles.lookCard} onPress={onCreate}>
            <ImageTile
              aspectRatio={i % 3 === 0 ? 0.72 : 0.9}
              icon="images-outline"
              style={{ width: '100%' }}
            />
            <Text style={styles.lookTitle} numberOfLines={1}>
              {look.title}
            </Text>
            <Text style={styles.lookMeta}>{look.itemCount} items</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.xl },
  gear: { position: 'absolute', top: spacing.md, right: spacing.xl, padding: spacing.xs, zIndex: 2 },
  handleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  handle: { ...font.h3, color: colors.text },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  stat: { alignItems: 'center', paddingHorizontal: spacing.lg },
  statValue: { ...font.bodyStrong, color: colors.text },
  statLabel: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 24, backgroundColor: colors.border },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: spacing.md, gap: 6 },
  bio: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 4 },
  location: { ...font.tiny, color: colors.textMuted },
  segment: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  segBtnActive: { backgroundColor: colors.ink },
  segText: { ...font.small, color: colors.textMuted, fontWeight: '600' },
  segTextActive: { color: colors.white },
  body: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  wishRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.md },
  wishlistCard: {
    width: 300,
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  wishTitle: { ...font.bodyStrong, color: colors.text },
  wishMeta: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  wishBody: { ...font.tiny, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 16 },
  wishTags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: 4 },
  addTile: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  addTileLabel: { ...font.small, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  addPill: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  addPillText: { ...font.small, color: colors.white, fontWeight: '700' },
  categoryBlock: { marginTop: spacing.lg },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  placeholderTile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  placeholderLabel: { ...font.tiny, color: colors.textMuted, fontWeight: '600', marginTop: spacing.sm },
  emptySlot: {
    width: 110,
    aspectRatio: 0.85,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rentPlaceholder: {
    width: 120,
    aspectRatio: 0.85,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emptyLooks: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl * 1.5,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: { ...font.h3, color: colors.text },
  emptySub: { ...font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  looksGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  lookCard: { width: '48%', marginBottom: spacing.lg },
  lookTitle: { ...font.small, color: colors.text, fontWeight: '700', marginTop: spacing.sm },
  lookMeta: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  introRoot: { flex: 1, backgroundColor: colors.white },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  introTitle: { ...font.bodyStrong, color: colors.text },
  introBody: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' },
  introMedia: {
    height: 360,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  introMediaText: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
  introFooter: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
});
