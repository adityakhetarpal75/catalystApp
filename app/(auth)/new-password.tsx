import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, font, spacing } from '../../constants/theme';

export default function NewPassword() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

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
            onChangeText={setPw}
          />
          <Input
            label="Confirm Password"
            icon="lock-closed-outline"
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Reset Password" onPress={() => router.replace('/(auth)/login-success')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text },
});
