import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '../constants/theme';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
}

export function Header({
  title,
  onBack,
  showBack = true,
  right,
  rightLabel,
  onRightPress,
}: HeaderProps) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.rightSide]}>
        {right}
        {rightLabel ? (
          <Pressable onPress={onRightPress} hitSlop={12}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  side: { width: 60, justifyContent: 'center' },
  rightSide: { alignItems: 'flex-end' },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', ...font.title, color: colors.text },
  rightLabel: { ...font.bodyStrong, color: colors.textMuted },
});
