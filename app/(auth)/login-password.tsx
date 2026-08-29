import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function LoginPassword() {
  const router = useRouter();
  const { pendingLogin, signIn } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    if (!pendingLogin.login) {
      setError('Go back and enter your email or username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(pendingLogin.login, password);
      router.replace('/(auth)/login-success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in');
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
        {pendingLogin.login ? (
          <Text style={styles.emailHint}>Signing in as {pendingLogin.login}</Text>
        ) : null}

        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="Your password"
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
