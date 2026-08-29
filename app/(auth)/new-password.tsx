import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function NewPassword() {
  const router = useRouter();
  const { pending, signIn } = useAuth();
  const { setProfile } = useApp();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onReset = async () => {
    if (pw.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (pw !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const email = pending.email || 'julia@example.com';
      await signIn({ email });
      setProfile({ email });
      router.replace('/(auth)/login-success');
    } catch {
      setError('Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <Header />
      <View style={styles.body}>
        <Text style={styles.title}>New Password</Text>

        <View style={{ marginTop: spacing.xxl }}>
          <Input
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter a new password"
            secureTextEntry
            value={pw}
            onChangeText={(v) => {
              setPw(v);
              if (error) setError('');
            }}
          />
          <Input
            label="Confirm Password"
            icon="lock-closed-outline"
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirm}
            onChangeText={(v) => {
              setConfirm(v);
              if (error) setError('');
            }}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Reset Password" loading={loading} onPress={onReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text },
  error: { ...font.small, color: colors.danger, marginBottom: spacing.sm },
});
