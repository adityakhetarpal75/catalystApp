import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Provider = 'email' | 'facebook' | 'google' | 'apple';

const config: Record<
  Provider,
  { label: string; icon: keyof typeof Ionicons.glyphMap; dark: boolean; color?: string }
> = {
  email: { label: 'Continue With Email', icon: 'mail-outline', dark: true },
  facebook: { label: 'Continue With Facebook', icon: 'logo-facebook', dark: false, color: '#1877F2' },
  google: { label: 'Continue With Google', icon: 'logo-google', dark: false, color: '#DB4437' },
  apple: { label: 'Continue With Apple', icon: 'logo-apple', dark: false },
};

export function SocialButton({
  provider,
  onPress,
}: {
  provider: Provider;
  onPress?: () => void;
}) {
  const c = config[provider];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        c.dark ? styles.dark : styles.light,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Ionicons
        name={c.icon}
        size={20}
        color={c.dark ? colors.white : c.color || colors.ink}
        style={styles.icon}
      />
      <Text style={[styles.label, c.dark ? styles.labelDark : styles.labelLight]}>{c.label}</Text>
      <View style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dark: { backgroundColor: colors.ink },
  light: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong },
  icon: { width: 22 },
  label: { fontSize: 15, fontWeight: '600' },
  labelDark: { color: colors.white },
  labelLight: { color: colors.ink },
});
