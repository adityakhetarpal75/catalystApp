import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SocialButton } from '../../components/SocialButton';
import { useAuth } from '../../context/AuthContext';
import { emailTaken, usernameTaken } from '../../lib/accounts';
import { colors, font, spacing } from '../../constants/theme';

export default function Signup() {
  const router = useRouter();
  const { setPendingSignup } = useAuth();
  const [mode, setMode] = useState<'landing' | 'form'>('landing');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (mode === 'landing') {
    return (
      <Screen padded={false}>
        <Header showBack onBack={() => router.back()} />
        <View style={styles.body}>
          <Text style={styles.title}>Let’s get started!</Text>
          <Text style={styles.subtitle}>
            Create your Catalyst account with an email, username, and password.
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

  const onNext = async () => {
    const trimmedEmail = email.trim();
    const trimmedUser = username.trim().replace(/^@/, '');
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (trimmedUser.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-z0-9._]+$/i.test(trimmedUser)) {
      setError('Username can only use letters, numbers, dots, and underscores');
      return;
    }
    if (!first.trim() || !last.trim()) {
      setError('First and last name are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (await emailTaken(trimmedEmail)) {
        setError('An account with this email already exists. Try logging in.');
        return;
      }
      if (await usernameTaken(trimmedUser)) {
        setError('That username is already taken');
        return;
      }
      setPendingSignup({
        email: trimmedEmail,
        username: trimmedUser,
        firstName: first.trim(),
        lastName: last.trim(),
      });
      router.push('/(auth)/signup-password');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        autoCorrect={false}
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (error) setError('');
        }}
      />
      <Input
        label="Username*"
        icon="at-outline"
        placeholder="Choose a unique username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={(v) => {
          setUsername(v);
          if (error) setError('');
        }}
      />
      <Input
        label="First Name*"
        placeholder="Your first name"
        value={first}
        onChangeText={(v) => {
          setFirst(v);
          if (error) setError('');
        }}
      />
      <Input
        label="Last Name*"
        placeholder="Your last name"
        value={last}
        onChangeText={(v) => {
          setLast(v);
          if (error) setError('');
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Next" loading={loading} style={{ marginTop: spacing.lg }} onPress={onNext} />
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
  error: { ...font.small, color: colors.danger, marginBottom: spacing.sm },
});
