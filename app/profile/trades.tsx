import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { ImageTile } from '../../components/ui';
import { trades } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Trades() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Trades" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {trades.map((t) => (
          <View key={t.id} style={styles.card}>
            <View style={styles.swap}>
              <View style={styles.side}>
                <ImageTile size={84} icon="shirt-outline" />
                <Text style={styles.brand}>{t.giveBrand}</Text>
                <Text style={styles.name} numberOfLines={1}>{t.give}</Text>
              </View>
              <View style={styles.swapIcon}>
                <Ionicons name="swap-horizontal" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.side}>
                <ImageTile size={84} icon="shirt-outline" />
                <Text style={styles.brand}>{t.getBrand}</Text>
                <Text style={styles.name} numberOfLines={1}>{t.get}</Text>
              </View>
            </View>
            <View style={styles.meta}>
              <Row label="Order Date" value={t.date} />
              <Row label="Status" value={t.status} valueColor={colors.success} />
              <Row label="Order No" value={t.orderNo} />
              <Row label="Trade with" value={t.with} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor, fontWeight: '700' } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  swap: { flexDirection: 'row', alignItems: 'center' },
  side: { flex: 1, alignItems: 'center' },
  swapIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  brand: { ...font.tiny, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', marginTop: spacing.sm },
  name: { ...font.small, color: colors.text, fontWeight: '600' },
  meta: { marginTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.md, gap: 4 },
  row: { flexDirection: 'row' },
  rowLabel: { ...font.small, color: colors.textMuted, width: 100 },
  rowValue: { ...font.small, color: colors.text, flex: 1 },
});
