import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { ListRow } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Settings() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const onConfirmSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setConfirmOpen(false);
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Sign out failed', 'Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Screen scroll padded={false}>
      <Header title="Settings" />
      <View style={styles.body}>
        {user ? (
          <View style={styles.accountCard}>
            <Text style={styles.accountLabel}>Signed in as</Text>
            <Text style={styles.accountEmail}>{user.email}</Text>
            <Text style={styles.accountName}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
        ) : null}

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
        <ListRow
          label="Sign Out"
          danger
          icon="log-out-outline"
          onPress={() => setConfirmOpen(true)}
        />
      </View>

      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Sign out?</Text>
            <Text style={styles.sheetBody}>
              You’ll need to log in again to access your closet, wishlist, and circles.
            </Text>
            <Button label="Sign Out" loading={signingOut} onPress={onConfirmSignOut} style={{ marginTop: spacing.lg }} />
            <Button
              label="Cancel"
              variant="secondary"
              disabled={signingOut}
              onPress={() => setConfirmOpen(false)}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  accountCard: {
    backgroundColor: colors.canvas,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  accountLabel: { ...font.tiny, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  accountEmail: { ...font.bodyStrong, color: colors.text, marginTop: 4 },
  accountName: { ...font.small, color: colors.textMuted, marginTop: 2 },
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 340,
  },
  sheetTitle: { ...font.h2, color: colors.text, textAlign: 'center' },
  sheetBody: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
