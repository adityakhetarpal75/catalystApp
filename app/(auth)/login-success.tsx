import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, font, spacing } from '../../constants/theme';

export default function LoginSuccess() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/welcome');
      return;
    }
    const t = setTimeout(() => router.replace('/(tabs)/home'), 1800);
    return () => clearTimeout(t);
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />
      <View style={styles.center}>
        <Text style={styles.wave}>👋</Text>
        <Text style={styles.name}>{user?.firstName || user?.username || 'there'}</Text>
        <Text style={styles.sub}>Welcome back!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  wave: { fontSize: 48, marginBottom: spacing.md },
  name: { fontSize: 34, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  sub: { ...font.h3, color: colors.onDarkMuted, marginTop: spacing.xs, fontWeight: '500' },
  decorTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decorBottom: {
    position: 'absolute',
    bottom: -80,
    left: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
