import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, font, spacing } from '../../constants/theme';

export default function SignupSuccess() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.spark}>✨</Text>
        </View>
        <Text style={styles.title}>Welcome to Catalyst!</Text>
        <Text style={styles.subtitle}>Your account was successfully created</Text>
        <Text style={styles.hint}>
          Please answer the following questions to connect with community and have a customized
          shopping experience.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          label="Start"
          variant="secondary"
          onPress={() => router.replace('/(onboarding)/personal-info')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate, paddingHorizontal: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  spark: { fontSize: 34 },
  title: { fontSize: 26, fontWeight: '800', color: colors.white, textAlign: 'center' },
  subtitle: { ...font.h3, color: colors.white, marginTop: spacing.md, textAlign: 'center', fontWeight: '600' },
  hint: {
    ...font.small,
    color: colors.onDarkMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  footer: { paddingBottom: spacing.xl },
  decorTop: {
    position: 'absolute',
    top: -40,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decorBottom: {
    position: 'absolute',
    bottom: -70,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
