import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ProductCard } from '../../components/ProductCard';
import { Avatar, ImageTile, SectionTitle, Tag } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

type Segment = 'closet' | 'looks';

export default function Closet() {
  const router = useRouter();
  const { profile, items, wishlist, toggleWishlist } = useApp();
  const [segment, setSegment] = useState<Segment>('closet');

  const grouped = useMemo(() => {
    const forSale = items.filter((i) => !i.forRent);
    const forRent = items.filter((i) => i.forRent);
    const byCategory: Record<string, typeof items> = {};
    forSale.forEach((i) => {
      byCategory[i.category] = byCategory[i.category] || [];
      byCategory[i.category].push(i);
    });
    return { byCategory, forRent };
  }, [items]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile header */}
        <View style={styles.header}>
          <Pressable style={styles.gear} onPress={() => router.push('/profile/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
          <Avatar name={profile.username} size={84} ring />
          <Text style={styles.handle}>@{profile.username}</Text>

          <View style={styles.stats}>
            <Stat value={String(items.length)} label="Items" />
            <View style={styles.statDivider} />
            <Stat value="2" label="Looks" />
            <View style={styles.statDivider} />
            <Stat value="18" label="Matches" />
          </View>

          <View style={styles.tagsRow}>
            <Tag label="Rent" dark />
            <Tag label="Sell" dark />
            <Tag label="Vintage Queen" dark />
          </View>

          <Text style={styles.bio}>{profile.bio}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        </View>

        {/* Segmented control */}
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
          />
        ) : (
          <LooksContent onCreate={() => router.push('/closet/add-item')} />
        )}
      </ScrollView>
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
}: {
  grouped: { byCategory: Record<string, any[]>; forRent: any[] };
  wishlist: any[];
  toggleWishlist: (i: any) => void;
  onAdd: () => void;
  onEdit: () => void;
}) {
  const categories = Object.keys(grouped.byCategory);

  return (
    <View style={styles.body}>
      {/* Wishlist */}
      <SectionTitle title="Wishlist" action="Edit" onAction={onEdit} />
      {wishlist.length > 0 ? (
        <View style={styles.wishlistCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.wishTitle}>{wishlist[0].name}</Text>
            <Text style={styles.wishMeta}>Size: Small, Medium</Text>
            <Text style={styles.wishBody} numberOfLines={2}>
              Add main takeaway points, quotes, anecdotes, or a very short story about this piece.
            </Text>
            <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
              {(wishlist[0].tags || ['Vintage']).slice(0, 3).map((t: string, i: number) => (
                <Tag key={i} label={t} />
              ))}
            </View>
          </View>
          <ImageTile size={72} icon="shirt-outline" />
        </View>
      ) : (
        <Pressable style={styles.addTile} onPress={onAdd}>
          <Text style={styles.addTileLabel}>Add inspo pics of items you are looking for</Text>
          <View style={styles.addPill}>
            <Text style={styles.addPillText}>Add Items</Text>
          </View>
        </Pressable>
      )}

      {/* Closet by category */}
      <View style={{ marginTop: spacing.xl }}>
        <SectionTitle title="Closet" action="Edit" onAction={onEdit} />
        <Button label="+ Add item to closet" variant="secondary" onPress={onAdd} style={{ marginBottom: spacing.lg }} />
        {categories.map((cat) => (
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
            </ScrollView>
          </View>
        ))}
      </View>

      {/* Items to rent */}
      {grouped.forRent.length > 0 ? (
        <View style={styles.categoryBlock}>
          <SectionTitle title="Items to Rent" action="Edit" onAction={onEdit} />
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
        </View>
      ) : null}
    </View>
  );
}

function LooksContent({ onCreate }: { onCreate: () => void }) {
  const hasLooks = true;
  if (!hasLooks) {
    return (
      <View style={styles.emptyLooks}>
        <View style={styles.emptyIcon}>
          <Ionicons name="images-outline" size={30} color={colors.textFaint} />
        </View>
        <Text style={styles.emptyTitle}>You don’t have looks yet!</Text>
        <Text style={styles.emptySub}>Create looks to inspire the community & sell your items!</Text>
        <Button label="Create a look" onPress={onCreate} style={{ marginTop: spacing.xl }} fullWidth={false} />
      </View>
    );
  }
  const heights = [200, 150, 180, 220, 160, 190];
  return (
    <View style={[styles.body, styles.looksGrid]}>
      <View style={styles.looksCol}>
        {heights.filter((_, i) => i % 2 === 0).map((h, i) => (
          <ImageTile key={`a${i}`} aspectRatio={130 / h} icon="images-outline" style={{ marginBottom: spacing.md }} />
        ))}
      </View>
      <View style={styles.looksCol}>
        {heights.filter((_, i) => i % 2 === 1).map((h, i) => (
          <ImageTile key={`b${i}`} aspectRatio={130 / h} icon="images-outline" style={{ marginBottom: spacing.md }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.xl },
  gear: { position: 'absolute', top: spacing.md, right: spacing.xl, padding: spacing.xs },
  handle: { ...font.h3, color: colors.text, marginTop: spacing.md },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  stat: { alignItems: 'center', paddingHorizontal: spacing.lg },
  statValue: { ...font.bodyStrong, color: colors.text },
  statLabel: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 24, backgroundColor: colors.border },
  tagsRow: { flexDirection: 'row', marginTop: spacing.md },
  bio: { ...font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 19 },
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
  wishlistCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  wishTitle: { ...font.bodyStrong, color: colors.text },
  wishMeta: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  wishBody: { ...font.tiny, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 16 },
  addTile: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  addTileLabel: { ...font.small, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  addPill: { backgroundColor: colors.ink, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill },
  addPillText: { ...font.small, color: colors.white, fontWeight: '700' },
  categoryBlock: { marginTop: spacing.lg },
  emptyLooks: { alignItems: 'center', paddingHorizontal: spacing.xxxl, paddingVertical: spacing.xxxl * 1.5 },
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
  looksGrid: { flexDirection: 'row', gap: spacing.md },
  looksCol: { flex: 1 },
});
