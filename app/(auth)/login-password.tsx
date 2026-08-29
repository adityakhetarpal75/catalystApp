import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function LoginPassword() {
  const router = useRouter();
  const { pending, signIn } = useAuth();
  const { setProfile } = useApp();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    if (password.length < 1) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const email = pending.email || 'julia@example.com';
      const firstName = pending.firstName || 'Julia';
      const lastName = pending.lastName || 'Jess';
      await signIn({ email, firstName, lastName });
      setProfile({ email, firstName, lastName });
      router.replace('/(auth)/login-success');
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <Header title="Log in" />
      <View style={styles.body}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Please enter your password</Text>
        {pending.email ? (
          <Text style={styles.emailHint}>Signing in as {pending.email}</Text>
        ) : null}

        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (error) setError('');
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgot}>
          <Text style={styles.forgotText}>I forgot my password</Text>
        </Pressable>

        <View style={{ flex: 1 }} />
        <Button label="Log In" loading={loading} onPress={onLogin} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
  emailHint: { ...font.small, color: colors.textMuted, marginBottom: spacing.xl },
  error: { ...font.small, color: colors.danger, marginBottom: spacing.sm, marginTop: -spacing.sm },
  forgot: { marginTop: spacing.xs },
  forgotText: { ...font.small, color: colors.textMuted, textDecorationLine: 'underline' },
});
