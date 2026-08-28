import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Tag } from '../../components/ui';
import { closetItems } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, wishlist, toggleWishlist } = useApp();
  const item = [...items, ...closetItems].find((i) => i.id === id) || closetItems[0];
  const wishlisted = !!wishlist.find((w) => w.id === item.id);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.gallery}>
          <Ionicons name="shirt-outline" size={64} color={colors.textFaint} />
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeBadgeText}>Size {item.size}</Text>
          </View>
        </View>
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <Pressable key={i} onPress={() => setActiveImage(i)}>
              <View style={[styles.dot, activeImage === i && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <View style={styles.body}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>

          <View style={styles.actions}>
            <Button
              label={item.forRent ? 'Rent Now' : 'Buy Now'}
              onPress={() => {}}
              style={{ marginBottom: spacing.md }}
            />
            <Button
              label={wishlisted ? 'Saved to Wishlist' : 'Add To Wishlist'}
              variant="secondary"
              onPress={() => toggleWishlist(item)}
            />
          </View>

          <Section title="Description">
            <Text style={styles.paragraph}>
              The perfect vintage {item.name.toLowerCase()} for you to fall in love with. The colour goes
              with all kinds of outfits and elevates any look effortlessly.
            </Text>
            <View style={styles.tagsRow}>
              {(item.tags || []).map((t, i) => (
                <Tag key={i} label={t} />
              ))}
            </View>
          </Section>

          <View style={styles.metaGrid}>
            <Meta label="Material" value={item.material || '—'} />
            <Meta label="Condition" value={item.condition || '—'} />
            <Meta label="Color" value={item.color || '—'} />
            <Meta label="Category" value={item.category} />
          </View>

          <Section title="Notes from the seller">
            {[
              'Gently worn, no visible flaws or stains.',
              'Ships within 2 business days from San Francisco.',
              'Open to bundles — check out the rest of my closet!',
            ].map((n, i) => (
              <View key={i} style={styles.noteRow}>
                <View style={styles.bullet} />
                <Text style={styles.noteText}>{n}</Text>
              </View>
            ))}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gallery: {
    marginHorizontal: spacing.xl,
    height: 340,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  sizeBadgeText: { ...font.tiny, color: colors.text, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.ink, width: 18 },
  body: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  brand: { ...font.small, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  name: { ...font.h2, color: colors.text, marginTop: 2 },
  price: { ...font.h3, color: colors.text, marginTop: spacing.sm },
  actions: { marginTop: spacing.xl },
  section: { marginTop: spacing.xl },
  sectionTitle: { ...font.h3, color: colors.text, marginBottom: spacing.sm },
  paragraph: { ...font.body, color: colors.textMuted, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', marginTop: spacing.md, flexWrap: 'wrap', gap: 6 },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  metaItem: { width: '50%', padding: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  metaLabel: { ...font.tiny, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { ...font.bodyStrong, color: colors.text, marginTop: 4 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  bullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.textMuted, marginTop: 8, marginRight: spacing.md },
  noteText: { ...font.body, color: colors.textMuted, flex: 1, lineHeight: 21 },
});
