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
  const [buyFlash, setBuyFlash] = useState(false);

  const description =
    item.description ||
    `The perfect vintage ${item.name.toLowerCase()} for you to fall in love with. The colour goes with all kinds of outfits and elevates any look effortlessly.`;

  const notes = item.notes || [
    'Gently worn, no visible flaws or stains.',
    'Ships within 2 business days from San Francisco.',
    'Open to bundles — check out the rest of my closet!',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable
          hitSlop={12}
          style={styles.iconBtn}
          onPress={() => toggleWishlist(item)}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={wishlisted ? colors.danger : colors.text}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.gallery}>
          <Ionicons name="shirt-outline" size={64} color={colors.textFaint} />
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
          <View style={styles.priceRow}>
            <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
            <Text style={styles.size}>Size: {item.size}</Text>
          </View>

          <View style={styles.actions}>
            <Button
              label={item.forRent ? 'Rent Now' : 'Buy Now'}
              onPress={() => {
                setBuyFlash(true);
                setTimeout(() => setBuyFlash(false), 1600);
              }}
              style={{ marginBottom: spacing.md }}
            />
            <Button
              label={wishlisted ? 'Saved to Wishlist' : 'Add To Wishlist'}
              variant="secondary"
              onPress={() => toggleWishlist(item)}
            />
            {buyFlash ? (
              <Text style={styles.buyHint}>
                {item.forRent ? 'Rental request started (demo).' : 'Checkout started (demo).'}
              </Text>
            ) : null}
          </View>

          <Section title="Description">
            <Text style={styles.paragraph}>{description}</Text>
            <View style={styles.tagsRow}>
              {(item.tags || ['Tag 1', 'Tag 2', 'Tag 3']).map((t, i) => (
                <Tag key={`${t}-${i}`} label={t} />
              ))}
            </View>
          </Section>

          <View style={styles.metaList}>
            <MetaRow label="Material" value={item.material || '—'} />
            <MetaRow label="Condition" value={item.condition || '—'} />
            <MetaRow label="Color" value={item.color || '—'} />
            <MetaRow label="Category" value={item.category} last />
          </View>

          <Section title="Notes from the seller">
            {notes.map((n, i) => (
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

function MetaRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.metaRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  topTitle: { ...font.bodyStrong, color: colors.text, flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
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
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.ink, width: 18 },
  body: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  brand: { ...font.small, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  name: { ...font.h2, color: colors.text, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: { ...font.h3, color: colors.text },
  size: { ...font.body, color: colors.textMuted, fontWeight: '600' },
  actions: { marginTop: spacing.xl },
  buyHint: { ...font.small, color: colors.success, textAlign: 'center', marginTop: spacing.md },
  section: { marginTop: spacing.xl },
  sectionTitle: { ...font.h3, color: colors.text, marginBottom: spacing.sm },
  paragraph: { ...font.body, color: colors.textMuted, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', marginTop: spacing.md, flexWrap: 'wrap', gap: 6 },
  metaList: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  metaLabel: { ...font.small, color: colors.textMuted, fontWeight: '600' },
  metaValue: { ...font.bodyStrong, color: colors.text },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.textMuted,
    marginTop: 8,
    marginRight: spacing.md,
  },
  noteText: { ...font.body, color: colors.textMuted, flex: 1, lineHeight: 21 },
});
