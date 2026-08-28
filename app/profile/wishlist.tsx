import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { closetItems } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, spacing } from '../../constants/theme';

export default function Wishlist() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useApp();
  const items = wishlist.length ? wishlist : closetItems.slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Wishlist" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {items.map((item) => (
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
        {items.length === 0 ? (
          <Pressable onPress={() => router.push('/(tabs)/discover')}>
            <Text style={styles.empty}>Your wishlist is empty. Tap to discover items →</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.md },
  gridItem: { width: '48%' },
  empty: { ...font.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxxl },
});
