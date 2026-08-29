import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { SocialButton } from '../../components/SocialButton';
import { ImageTile } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function Welcome() {
  const router = useRouter();
  const { isLoading, isAuthenticated, user, signIn, setPending } = useAuth();
  const { setProfile } = useApp();
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Redirect
        href={user.onboardingComplete ? '/(tabs)/home' : '/(onboarding)/personal-info'}
      />
    );
  }

  const socialLogin = async (provider: 'facebook' | 'google') => {
    setBusy(true);
    try {
      setPending({
        email: `${provider}@catalyst.app`,
        firstName: 'Julia',
        lastName: 'Jess',
      });
      await signIn({
        email: `${provider}@catalyst.app`,
        firstName: 'Julia',
        lastName: 'Jess',
      });
      setProfile({
        email: `${provider}@catalyst.app`,
        firstName: 'Julia',
        lastName: 'Jess',
      });
      router.replace('/(auth)/login-success');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Hi there!</Text>
        <Text style={styles.subtitle}>
          You can log in with your email, Facebook or Google account.
        </Text>
      </View>

      <View style={styles.hero}>
        <ImageTile size={120} icon="shirt-outline" style={{ borderRadius: 20 }} />
      </View>

      <View style={styles.actions}>
        <SocialButton provider="email" onPress={() => router.push('/(auth)/login-email')} />
        <SocialButton provider="facebook" onPress={() => socialLogin('facebook')} />
        <SocialButton provider="google" onPress={() => socialLogin('google')} />
        {busy ? <ActivityIndicator style={{ marginTop: spacing.sm }} color={colors.ink} /> : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.link}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  header: { marginTop: spacing.xxxl, marginBottom: spacing.lg },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 21 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { paddingBottom: spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  footerText: { ...font.small, color: colors.textMuted },
  link: { ...font.small, color: colors.ink, fontWeight: '700' },
});
