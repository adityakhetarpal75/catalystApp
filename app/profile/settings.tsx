import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { ListRow } from '../../components/ui';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Settings() {
  const router = useRouter();

  return (
    <Screen scroll padded={false}>
      <Header title="Settings" />
      <View style={styles.body}>
        <ListRow label="Edit Profile" onPress={() => router.push('/profile/edit')} />
        <ListRow label="My Sales" onPress={() => router.push('/profile/sales')} />
        <ListRow label="My Purchases" onPress={() => router.push('/profile/purchases')} />
        <ListRow label="My Trades" onPress={() => router.push('/profile/trades')} />
        <ListRow label="Shipping Information" onPress={() => router.push('/profile/shipping')} />
        <ListRow label="My Wishlist" onPress={() => router.push('/profile/wishlist')} />

        <Pressable style={styles.invite}>
          <Ionicons name="gift-outline" size={22} color={colors.ink} />
          <Text style={styles.inviteText}>Invite Friends, Earn Points</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        <ListRow label="Rate & Review the App" />
        <ListRow label="Contact Catalyst" />
        <ListRow label="Notification Settings" />
        <ListRow label="Sign Out" danger icon="log-out-outline" onPress={() => router.replace('/(auth)/welcome')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  inviteText: { flex: 1, ...font.bodyStrong, color: colors.text },
});
