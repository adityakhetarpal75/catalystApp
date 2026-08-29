import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { useApp } from '../../context/AppContext';
import { colors, font, spacing } from '../../constants/theme';

export default function Wishlist() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Wishlist" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {wishlist.length > 0 ? (
          <View style={styles.grid}>
            {wishlist.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <ProductCard
                  item={item}
                  width="100%"
                  wishlisted
                  onWishlist={() => toggleWishlist(item)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySub}>
              Save inspo pieces from Discover or other closets to keep them here.
            </Text>
            <Button
              label="Browse Discover"
              onPress={() => router.push('/(tabs)/discover')}
              style={{ marginTop: spacing.xl }}
              fullWidth={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  gridItem: { width: '48%' },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2, paddingHorizontal: spacing.xl },
  emptyTitle: { ...font.h3, color: colors.text },
  emptySub: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
