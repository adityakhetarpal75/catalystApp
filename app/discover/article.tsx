import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { articles, beautyProducts } from '../../constants/data';
import { colors, font, radius, shadow, spacing } from '../../constants/theme';

const body = `There is an abundance of brands, blogs, and retailers constantly shelling out education and the latest news, but sorting through these offerings trying to find what pertains to you can be a full-time job. It's incredibly rare to find resources that are up-to-date and that specifically speak to the needs of people within the context of trends.

Choosing the right resources can be the best way to get real, need-to-know beauty news popping up on your phone — like a pocket educator and best friend in one. Here's a roundup of top voices that have been gaining attention for in-depth interviews with industry-changing founders and sparking conversations that were previously taboo.`;

export default function Article() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const article = articles.find((a) => a.id === id) || articles[0];
  const product = beautyProducts[1];
  const [showProduct, setShowProduct] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Article</Text>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.meta}>
            {article.date} · {article.readTime}
          </Text>
          <View style={styles.hero}>
            <Ionicons name="image-outline" size={40} color={colors.textFaint} />
          </View>

          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.author}>BY {article.author.toUpperCase()}</Text>
          <Text style={styles.header}>{article.header}</Text>

          <Text style={styles.paragraph}>{body}</Text>

          <View style={styles.pullImage}>
            <Text style={styles.pullText}>BEAUTYME</Text>
          </View>

          <Text style={styles.paragraph}>{body}</Text>
        </ScrollView>

        {showProduct ? (
          <View style={styles.productOverlay}>
            <View style={styles.productImg}>
              <Ionicons name="cube-outline" size={22} color={colors.onDarkFaint} />
            </View>
            <View style={{ flex: 1 }}>
              {product.category ? (
                <Text style={styles.productCat}>{product.category}</Text>
              ) : null}
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                ${product.price}
                {product.points ? ` + ${product.points} points` : ''}
              </Text>
            </View>
            <Pressable
              style={styles.productCta}
              onPress={() =>
                router.push({ pathname: '/discover/brand', params: { name: product.brand } })
              }
            >
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </Pressable>
            <Pressable style={styles.productClose} onPress={() => setShowProduct(false)}>
              <Ionicons name="close" size={14} color={colors.onDarkFaint} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.productFab} onPress={() => setShowProduct(true)}>
            <Ionicons name="cube-outline" size={16} color={colors.white} />
            <Ionicons name="add" size={14} color={colors.white} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  topTitle: { ...font.title, color: colors.text },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.xl, paddingBottom: 120 },
  meta: { ...font.tiny, color: colors.textMuted, marginBottom: spacing.md },
  hero: {
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...font.h1, color: colors.coral, letterSpacing: -0.5 },
  header: { ...font.h3, color: colors.text, fontWeight: '600', marginTop: spacing.sm },
  author: { ...font.tiny, color: colors.textMuted, fontWeight: '700', marginTop: spacing.md },
  paragraph: { ...font.body, color: colors.textMuted, lineHeight: 23, marginTop: spacing.lg },
  pullImage: {
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  pullText: { fontSize: 28, fontWeight: '800', color: colors.coral, letterSpacing: 1 },
  productOverlay: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.darkSurface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.floating,
  },
  productImg: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productCat: { ...font.tiny, color: colors.coral, fontWeight: '700' },
  productBrand: {
    ...font.tiny,
    color: colors.onDarkFaint,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  productName: { ...font.small, color: colors.onDarkText, fontWeight: '700', marginTop: 1 },
  productPrice: { ...font.tiny, color: colors.onDarkMuted, marginTop: 2 },
  productCta: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productClose: { position: 'absolute', top: 6, right: 6 },
  productFab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
