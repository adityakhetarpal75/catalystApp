import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ClosetItem } from '../constants/data';
import { colors, font, radius, spacing } from '../constants/theme';
import { ImageTile } from './ui';

export function ProductCard({
  item,
  width,
  onWishlist,
  wishlisted,
}: {
  item: ClosetItem;
  width?: number | string;
  onWishlist?: () => void;
  wishlisted?: boolean;
}) {
  const router = useRouter();
  return (
    <Pressable
      style={[styles.card, width ? { width: width as any } : { flex: 1 }]}
      onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
    >
      <View style={styles.imageWrap}>
        <ImageTile aspectRatio={0.82} icon="shirt-outline" />
        {item.forRent ? (
          <View style={styles.rentBadge}>
            <Text style={styles.rentText}>RENT</Text>
          </View>
        ) : null}
        <Pressable style={styles.heart} onPress={onWishlist} hitSlop={8}>
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlisted ? colors.danger : colors.text}
          />
        </Pressable>
      </View>
      <Text style={styles.brand} numberOfLines={1}>
        {item.brand}
      </Text>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.price}>${item.price.toFixed(0)}</Text>
        <Text style={styles.size}>Size {item.size}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  imageWrap: { position: 'relative', marginBottom: spacing.sm },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  rentText: { ...font.tiny, color: colors.white, fontWeight: '800', letterSpacing: 0.5 },
  brand: { ...font.tiny, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  name: { ...font.small, color: colors.text, fontWeight: '600', marginTop: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { ...font.bodyStrong, color: colors.text },
  size: { ...font.tiny, color: colors.textFaint },
});
