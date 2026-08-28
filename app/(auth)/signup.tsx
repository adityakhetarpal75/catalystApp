import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SocialButton } from '../../components/SocialButton';
import { useApp } from '../../context/AppContext';
import { colors, font, spacing } from '../../constants/theme';

export default function Signup() {
  const router = useRouter();
  const { setProfile } = useApp();
  const [mode, setMode] = useState<'landing' | 'form'>('landing');
  const [email, setEmail] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');

  if (mode === 'landing') {
    return (
      <Screen padded={false}>
        <Header showBack onBack={() => router.back()} />
        <View style={styles.body}>
          <Text style={styles.title}>Let’s get started!</Text>
          <Text style={styles.subtitle}>
            You can sign up with your email, Facebook or Google account.
          </Text>

          <View style={{ flex: 1 }} />

          <SocialButton provider="email" onPress={() => setMode('form')} />
          <SocialButton provider="facebook" onPress={() => setMode('form')} />
          <SocialButton provider="google" onPress={() => setMode('form')} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/login-email')}>
              <Text style={styles.link}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="Create an Account" onBack={() => setMode('landing')} />
      <Text style={styles.formTitle}>Let’s get started!</Text>
      <Text style={styles.formSub}>Sign up with your email</Text>

      <Input
        label="Email Account"
        icon="mail-outline"
        placeholder="name@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Input label="First Name*" placeholder="Julia" value={first} onChangeText={setFirst} />
      <Input label="Last Name*" placeholder="Jess" value={last} onChangeText={setLast} />

      <Button
        label="Next"
        style={{ marginTop: spacing.lg }}
        onPress={() => {
          if (first) setProfile({ firstName: first });
          if (last) setProfile({ lastName: last });
          if (email) setProfile({ email });
          router.push('/(auth)/signup-password');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 21 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...font.small, color: colors.textMuted },
  link: { ...font.small, color: colors.ink, fontWeight: '700' },
  formTitle: { ...font.h1, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  formSub: { ...font.body, color: colors.textMuted, marginBottom: spacing.xl },
});
