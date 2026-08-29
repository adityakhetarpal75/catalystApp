import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function SignupPassword() {
  const router = useRouter();
  const { pendingSignup, signUp } = useAuth();
  const [pw, setPw] = useState('');
  const [repeat, setRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onNext = async () => {
    if (!pendingSignup.email || !pendingSignup.username) {
      setError('Go back and fill in your account details');
      return;
    }
    if (pw.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (pw !== repeat) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(pw);
      router.push({ pathname: '/(auth)/check-email', params: { flow: 'signup' } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <Header title="Create an Account" />
      <View style={styles.body}>
        <Text style={styles.title}>Create password</Text>
        <Text style={styles.subtitle}>
          Create a strong password with at least 8 characters
          {pendingSignup.username ? ` for @${pendingSignup.username}` : ''}
        </Text>

        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="At least 8 characters"
          secureTextEntry
          value={pw}
          onChangeText={(v) => {
            setPw(v);
            if (error) setError('');
          }}
        />
        <Input
          label="Repeat Password"
          icon="lock-closed-outline"
          placeholder="Re-enter your password"
          secureTextEntry
          value={repeat}
          onChangeText={(v) => {
            setRepeat(v);
            if (error) setError('');
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Create Account" loading={loading} onPress={onNext} />
        <Text style={styles.terms}>
          By creating an account you agree to our{' '}
          <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl },
  error: { ...font.small, color: colors.danger, marginBottom: spacing.md },
  terms: { ...font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  link: { color: colors.ink, fontWeight: '700' },
});
