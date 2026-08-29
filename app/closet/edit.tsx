import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { ImageTile } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function EditCloset() {
  const router = useRouter();
  const { items, removeItem, wishlist, toggleWishlist } = useApp();

  const byCategory = useMemo(() => {
    const map: Record<string, typeof items> = {};
    items.forEach((i) => {
      map[i.category] = map[i.category] || [];
      map[i.category].push(i);
    });
    return map;
  }, [items]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Edit My Closet" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Button
          label="+ Add item to closet"
          variant="secondary"
          onPress={() => router.push('/closet/add-item')}
          style={{ marginBottom: spacing.xl }}
        />

        <Text style={styles.section}>My Wishlist</Text>
        <View style={styles.grid}>
          {wishlist.map((item) => (
            <RemovableTile key={item.id} label={item.name} onRemove={() => toggleWishlist(item)} />
          ))}
          {wishlist.length === 0 ? <Text style={styles.empty}>No wishlist items yet</Text> : null}
        </View>

        {Object.keys(byCategory).map((cat) => (
          <View key={cat}>
            <Text style={styles.section}>{cat}</Text>
            <View style={styles.grid}>
              {byCategory[cat].map((item) => (
                <RemovableTile
                  key={item.id}
                  label={item.name}
                  rent={item.forRent}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Done" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

function RemovableTile({
  label,
  onRemove,
  rent,
}: {
  label: string;
  onRemove: () => void;
  rent?: boolean;
}) {
  return (
    <View style={styles.tileWrap}>
      <ImageTile aspectRatio={0.85} icon="shirt-outline" />
      {rent ? (
        <View style={styles.rentBadge}>
          <Text style={styles.rentText}>RENT</Text>
        </View>
      ) : null}
      <Pressable style={styles.removeBtn} onPress={onRemove} hitSlop={8}>
        <Ionicons name="close" size={14} color={colors.white} />
      </Pressable>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  section: { ...font.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tileWrap: { width: '31%', marginBottom: spacing.lg, position: 'relative' },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  rentBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.ink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    zIndex: 1,
  },
  rentText: { ...font.tiny, color: colors.white, fontWeight: '800', fontSize: 9 },
  tileLabel: { ...font.tiny, color: colors.textMuted, marginTop: 4 },
  empty: { ...font.small, color: colors.textFaint, marginBottom: spacing.md },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
