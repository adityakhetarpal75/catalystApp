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
  const { pendingLogin, setPendingLogin } = useAuth();
  const [login, setLogin] = useState(pendingLogin.login);
  const [error, setError] = useState('');

  const onNext = () => {
    const trimmed = login.trim();
    if (!trimmed) {
      setError('Enter your email or username');
      return;
    }
    setError('');
    setPendingLogin({ login: trimmed });
    router.push('/(auth)/login-password');
  };

  return (
    <Screen padded={false}>
      <Header title="Log in" />
      <View style={styles.body}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in with your email or username</Text>

        <Input
          label="Email or Username"
          icon="person-outline"
          placeholder="name@email.com or username"
          autoCapitalize="none"
          autoCorrect={false}
          value={login}
          onChangeText={(v) => {
            setLogin(v);
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
