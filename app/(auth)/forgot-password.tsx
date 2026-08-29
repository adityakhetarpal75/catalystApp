import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { findAccountByEmailOrUsername } from '../../lib/accounts';
import { colors, font, spacing } from '../../constants/theme';

export default function ForgotPassword() {
  const router = useRouter();
  const { setPendingLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter the email for your account');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const account = await findAccountByEmailOrUsername(trimmed);
      if (!account) {
        setError('No account found with that email. Create an account first.');
        return;
      }
      setPendingLogin({ login: account.email });
      router.push('/(auth)/check-email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <Header />
      <View style={styles.body}>
        <Text style={styles.title}>Enter your email to reset your password</Text>

        <Input
          label="Email"
          icon="mail-outline"
          placeholder="name@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (error) setError('');
          }}
          containerStyle={{ marginTop: spacing.xxl }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ flex: 1 }} />
        <Button label="Reset Password" loading={loading} onPress={onReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text, lineHeight: 34 },
  error: { ...font.small, color: colors.danger, marginTop: -spacing.sm },
});
