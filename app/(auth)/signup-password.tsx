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
  const { signUp } = useAuth();
  const [pw, setPw] = useState('');
  const [repeat, setRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onNext = async () => {
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
      await signUp();
      router.push({ pathname: '/(auth)/check-email', params: { flow: 'signup' } });
    } catch {
      setError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <Header title="Create an Account" />
      <View style={styles.body}>
        <Text style={styles.title}>Create password</Text>
        <Text style={styles.subtitle}>Create a strong password with at least 8 characters</Text>

        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="••••••••"
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
          placeholder="••••••••"
          secureTextEntry
          value={repeat}
          onChangeText={(v) => {
            setRepeat(v);
            if (error) setError('');
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Next" loading={loading} onPress={onNext} />
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
