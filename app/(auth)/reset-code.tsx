import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function ResetCode() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const setDigit = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 3) inputs.current[index + 1]?.focus();
  };

  return (
    <Screen padded={false}>
      <Header />
      <View style={styles.body}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code just sent to <Text style={styles.email}>email@example.com.</Text>
        </Text>

        <View style={styles.codeRow}>
          {code.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputs.current[i] = r;
              }}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.codeBox, d ? styles.codeBoxFilled : null]}
            />
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Enter Code" onPress={() => router.push('/(auth)/new-password')} />
        <Pressable style={styles.resend}>
          <Text style={styles.resendText}>
            Didn’t get the email? <Text style={styles.resendLink}>Resend Code</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 21 },
  email: { color: colors.text, fontWeight: '700' },
  codeRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  codeBox: {
    width: 60,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  codeBoxFilled: { borderColor: colors.ink, backgroundColor: '#FAFAFA' },
  resend: { alignItems: 'center', marginTop: spacing.lg },
  resendText: { ...font.small, color: colors.textMuted },
  resendLink: { color: colors.ink, fontWeight: '700' },
});
