import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, font, spacing } from '../../constants/theme';

export default function CheckEmail() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const isSignup = flow === 'signup';

  return (
    <Screen padded={false}>
      <Header />
      <View style={styles.body}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'We sent a confirmation email to '
            : 'We sent an email to reset your password to '}
          <Text style={styles.email}>email@example.com.</Text>
        </Text>
        <Text style={styles.hint}>
          If you haven’t received an email, please check your spam folder or click “resend email” to
          request a new one.
        </Text>

        <View style={styles.actions}>
          <Button
            label="Open Email"
            onPress={() =>
              isSignup ? router.push('/(auth)/signup-success') : router.push('/(auth)/reset-code')
            }
          />
          <View style={{ height: spacing.md }} />
          <Button label="Resend Email" variant="secondary" onPress={() => {}} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.md, lineHeight: 21 },
  email: { color: colors.text, fontWeight: '700' },
  hint: { ...font.small, color: colors.textMuted, marginTop: spacing.lg, lineHeight: 20 },
  actions: { marginTop: spacing.xxl },
});
