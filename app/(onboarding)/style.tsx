import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { styleOptions } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function StyleStep() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [selected, setSelected] = useState<string>();

  return (
    <OnboardingScaffold
      step={3}
      total={8}
      title="How would you describe your style?"
      subtitle="Select the type that best describes your personal style"
      nextDisabled={!selected}
      onNext={() => {
        setOnboarding({ style: selected });
        router.push('/(onboarding)/goals');
      }}
    >
      <View style={styles.grid}>
        {styleOptions.map((opt) => {
          const active = selected === opt.key;
          return (
            <Pressable
              key={opt.key}
              style={[styles.tile, active && styles.tileActive]}
              onPress={() => setSelected(opt.key)}
            >
              <View style={[styles.imageWell, active && styles.imageWellActive]}>
                {active ? (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={28} color={colors.white} />
                  </View>
                ) : (
                  <Ionicons name="image-outline" size={28} color={colors.textFaint} />
                )}
              </View>
              <Text style={styles.label}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', marginBottom: spacing.lg },
  tileActive: {},
  imageWell: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  imageWellActive: {
    backgroundColor: '#C5CDD6',
    borderColor: '#C5CDD6',
  },
  checkBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...font.small, color: colors.text, fontWeight: '600', textAlign: 'center' },
});
