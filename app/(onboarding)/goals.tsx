import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Chip } from '../../components/Chip';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { thriftingGoals } from '../../constants/data';
import { useApp } from '../../context/AppContext';

export default function Goals() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (g: string) =>
    setSelected((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  return (
    <OnboardingScaffold
      step={4}
      total={8}
      title="What are your main thrifting goals?"
      subtitle="Select as many as you like!"
      onNext={() => {
        setOnboarding({ goals: selected });
        router.push('/(onboarding)/sizes');
      }}
    >
      <View>
        {thriftingGoals.map((g) => (
          <Chip
            key={g}
            block
            label={g}
            selected={selected.includes(g)}
            onPress={() => toggle(g)}
          />
        ))}
      </View>
    </OnboardingScaffold>
  );
}
