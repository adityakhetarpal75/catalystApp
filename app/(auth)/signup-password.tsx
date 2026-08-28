import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, font, spacing } from '../../constants/theme';

export default function SignupPassword() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [repeat, setRepeat] = useState('');

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
          onChangeText={setPw}
        />
        <Input
          label="Repeat Password"
          icon="lock-closed-outline"
          placeholder="••••••••"
          secureTextEntry
          value={repeat}
          onChangeText={setRepeat}
        />

        <Button
          label="Next"
          onPress={() => router.push({ pathname: '/(auth)/check-email', params: { flow: 'signup' } })}
        />
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
  terms: { ...font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  link: { color: colors.ink, fontWeight: '700' },
});
