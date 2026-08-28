import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { CheckRow } from '../../components/CheckRow';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { identityOptions } from '../../constants/data';
import { useApp } from '../../context/AppContext';

export default function Community() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) =>
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));

  return (
    <OnboardingScaffold
      step={1}
      total={8}
      title="Help us find your community"
      subtitle="What best describes your identity?"
      onNext={() => {
        setOnboarding({ identities: selected });
        router.push('/(onboarding)/age');
      }}
    >
      {identityOptions.map((opt) => (
        <CheckRow key={opt} label={opt} checked={selected.includes(opt)} onPress={() => toggle(opt)} />
      ))}
    </OnboardingScaffold>
  );
}
