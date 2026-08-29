import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, shadow, spacing } from '../constants/theme';

// Minimal shape of the props expo-router passes to a custom `tabBar`.
interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    navigate: (name: never) => void;
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
  };
}

type Slot = { name: string; label: string; icon: keyof typeof Ionicons.glyphMap };

// Order shown around the raised center "+" button.
const LEFT: Slot[] = [
  { name: 'home', label: 'Home', icon: 'home-outline' },
  { name: 'discover', label: 'Discover', icon: 'search-outline' },
];
const RIGHT: Slot[] = [
  { name: 'closet', label: 'Cabinet', icon: 'grid-outline' },
  { name: 'channels', label: 'Channels', icon: 'chatbubbles-outline' },
];

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeName = state.routes[state.index]?.name;

  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(name as never);
  };

  const renderSlot = (slot: Slot) => {
    const focused = activeName === slot.name;
    return (
      <Pressable key={slot.name} style={styles.slot} onPress={() => go(slot.name)}>
        <Ionicons name={slot.icon} size={24} color={focused ? colors.ink : colors.textFaint} />
        <Text style={[styles.label, focused && styles.labelActive]}>{slot.label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {LEFT.map(renderSlot)}

      <View style={styles.fabSlot}>
        <Pressable style={styles.fab} onPress={() => setMenuOpen(true)}>
          <Ionicons name="add" size={30} color={colors.white} />
        </Pressable>
      </View>

      {RIGHT.map(renderSlot)}

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Create</Text>
            <CreateOption
              icon="shirt-outline"
              title="Add item to cabinet"
              subtitle="List something to sell, rent or trade"
              onPress={() => {
                setMenuOpen(false);
                router.push('/closet/add-item');
              }}
            />
            <CreateOption
              icon="chatbubble-ellipses-outline"
              title="Write a post"
              subtitle="Share with your circles"
              onPress={() => {
                setMenuOpen(false);
                router.push('/circles/vintage-finds');
              }}
            />
            <CreateOption
              icon="people-outline"
              title="Start a circle"
              subtitle="Build a new community"
              onPress={() => {
                setMenuOpen(false);
                router.push('/circles/explore');
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function CreateOption({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={22} color={colors.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  slot: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontSize: 11, fontWeight: '600', color: colors.textFaint },
  labelActive: { color: colors.ink },
  fabSlot: { width: 72, alignItems: 'center' },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    ...shadow.floating,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.lg },
  sheetTitle: { ...font.h3, color: colors.text, marginBottom: spacing.md },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { ...font.bodyStrong, color: colors.text },
  optionSub: { ...font.small, color: colors.textMuted, marginTop: 1 },
});
