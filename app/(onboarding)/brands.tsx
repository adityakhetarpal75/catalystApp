import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { brands } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Brands() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (b: string) =>
    setSelected((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const next = () => {
    setOnboarding({ brands: selected });
    router.push('/(onboarding)/follow');
  };

  return (
    <OnboardingScaffold
      step={6}
      total={8}
      title="Choose the brands you love and get recommendations"
      showSkip
      onSkip={next}
      onNext={next}
    >
      <View style={styles.grid}>
        {brands.map((b) => {
          const active = selected.includes(b);
          return (
            <Pressable key={b} style={[styles.tile, active && styles.tileActive]} onPress={() => toggle(b)}>
              {active ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.ink} style={styles.check} />
              ) : null}
              <Ionicons name="pricetag-outline" size={20} color={colors.textFaint} />
              <Text style={styles.label} numberOfLines={1}>
                {b}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  tileActive: { borderColor: colors.ink, backgroundColor: '#FAFAFA' },
  check: { position: 'absolute', top: 6, right: 6 },
  label: { ...font.tiny, color: colors.text, fontWeight: '600', marginTop: 6, paddingHorizontal: 4 },
});
