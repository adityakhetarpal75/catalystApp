import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, font } from '../constants/theme';

export default function Splash() {
  const router = useRouter();
  const { status, user, isLoading } = useAuth();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const navigated = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading || navigated.current) return;

    const t = setTimeout(() => {
      if (navigated.current) return;
      navigated.current = true;

      if (status === 'signedIn' && user) {
        if (user.onboardingComplete) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(onboarding)/personal-info');
        }
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 1200);

    return () => clearTimeout(t);
  }, [isLoading, status, user]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Text style={styles.logo}>CATALYST</Text>
          </View>
        </View>
        <Text style={styles.tagline}>thrift • trade • belong</Text>
        {isLoading ? <ActivityIndicator style={{ marginTop: 24 }} color={colors.slate} /> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center' },
  ringOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EAEEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DDE3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { ...font.h3, letterSpacing: 2, color: colors.slate },
  tagline: { marginTop: 24, ...font.small, color: colors.textMuted, letterSpacing: 1 },
});
