import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../constants/data';
import { colors, font, radius, spacing } from '../constants/theme';
import { ImageTile } from './ui';

const statusColor: Record<string, string> = {
  Completed: colors.success,
  Shipped: colors.ink,
  'In-progress': colors.warning,
  Processing: colors.warning,
};

export function OrderCard({ order, type }: { order: Order; type: 'sale' | 'purchase' }) {
  const isSale = type === 'sale';
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ImageTile size={92} icon="shirt-outline" />
        <View style={styles.info}>
          <Text style={styles.brand}>{order.brand}</Text>
          <Text style={styles.product} numberOfLines={2}>
            {order.product}
          </Text>
          <Text style={styles.amount}>${order.amount}</Text>
          <Text style={styles.amountLabel}>{isSale ? 'your earnings' : 'you paid'}</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Row label="Order Date" value={order.date} />
        <Row
          label="Status"
          value={order.status}
          valueColor={statusColor[order.status] || colors.text}
        />
        <Row label="Order No" value={order.orderNo} />
        <Row label={isSale ? 'Sold to' : 'Bought from'} value={order.counterparty} />
      </View>
    </View>
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
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  top: { flexDirection: 'row', gap: spacing.lg },
  info: { flex: 1 },
  brand: { ...font.tiny, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  product: { ...font.bodyStrong, color: colors.text, marginTop: 2 },
  amount: { ...font.h3, color: colors.text, marginTop: spacing.sm },
  amountLabel: { ...font.tiny, color: colors.textMuted },
  meta: { marginTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.md, gap: 4 },
  row: { flexDirection: 'row' },
  rowLabel: { ...font.small, color: colors.textMuted, width: 100 },
  rowValue: { ...font.small, color: colors.text, flex: 1 },
});
