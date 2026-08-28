import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';

/** Circular avatar. Falls back to initials when no uri given. */
export function Avatar({
  uri,
  size = 72,
  name,
  ring,
}: {
  uri?: string;
  size?: number;
  name?: string;
  ring?: boolean;
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.fillDeep,
        },
        ring && { borderWidth: 2, borderColor: colors.white, ...shadow.card },
        styles.center,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={{ fontSize: size * 0.32, fontWeight: '700', color: colors.textMuted }}>
          {initials || '★'}
        </Text>
      )}
    </View>
  );
}

/** Small rounded tag/pill for metadata. */
export function Tag({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <View style={[styles.tag, dark && styles.tagDark]}>
      <Text style={[styles.tagText, dark && styles.tagTextDark]}>{label}</Text>
    </View>
  );
}

/** Grey image well / placeholder tile. */
export function ImageTile({
  size,
  aspectRatio = 1,
  style,
  icon = 'image-outline',
  uri,
  rounded = true,
}: {
  size?: number;
  aspectRatio?: number;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  uri?: string;
  rounded?: boolean;
}) {
  return (
    <View
      style={[
        styles.tile,
        rounded && { borderRadius: radius.md },
        size ? { width: size, height: size } : { flex: 1, aspectRatio },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.fillAbsolute, rounded && { borderRadius: radius.md }]}
        />
      ) : (
        <Ionicons name={icon} size={22} color={colors.textFaint} />
      )}
    </View>
  );
}

/** White card surface. */
export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
        {content}
      </Pressable>
    );
  return content;
}

/** Settings-style list row with chevron. */
export function ListRow({
  label,
  onPress,
  danger,
  icon,
  value,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  value?: string;
}) {
  return (
    <Pressable style={styles.listRow} onPress={onPress}>
      <View style={styles.listRowLeft}>
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={danger ? colors.danger : colors.textMuted}
            style={{ marginRight: spacing.md }}
          />
        ) : null}
        <Text style={[styles.listLabel, danger && { color: colors.danger }]}>{label}</Text>
      </View>
      <View style={styles.listRowRight}>
        {value ? <Text style={styles.listValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </View>
    </Pressable>
  );
}

/** Section title used above content groups. */
export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Divider line. */
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  fillAbsolute: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  tag: {
    backgroundColor: colors.tagBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginRight: 6,
  },
  tagDark: { backgroundColor: colors.slate },
  tagText: { ...font.tiny, color: colors.textMuted, fontWeight: '600' },
  tagTextDark: { color: colors.white },
  tile: {
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  listRowLeft: { flexDirection: 'row', alignItems: 'center' },
  listRowRight: { flexDirection: 'row', alignItems: 'center' },
  listLabel: { ...font.body, color: colors.text },
  listValue: { ...font.small, color: colors.textMuted, marginRight: spacing.sm },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...font.h3, color: colors.text },
  sectionAction: { ...font.small, color: colors.textMuted, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
