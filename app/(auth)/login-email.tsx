import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, font, spacing } from '../../constants/theme';

export default function LoginEmail() {
  const router = useRouter();
  const [email, setEmail] = useState('');

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
          value={email}
          onChangeText={setEmail}
        />

        <Button label="Next" onPress={() => router.push('/(auth)/login-password')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xxl },
});
