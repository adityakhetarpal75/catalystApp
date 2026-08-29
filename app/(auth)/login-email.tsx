import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function LoginEmail() {
  const router = useRouter();
  const { pending, setPending } = useAuth();
  const [email, setEmail] = useState(pending.email);
  const [error, setError] = useState('');

  const onNext = () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setPending({ email: trimmed });
    router.push('/(auth)/login-password');
  };

  return (
    <Screen padded={false}>
      <Header title="Log in" />
      <View style={styles.body}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in with your email</Text>

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
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Next" onPress={onNext} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xxl },
  error: { ...font.small, color: colors.danger, marginBottom: spacing.md, marginTop: -spacing.sm },
});
