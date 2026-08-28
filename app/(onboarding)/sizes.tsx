import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { SelectField } from '../../components/SelectField';
import { sizeOptions } from '../../constants/data';
import { useApp } from '../../context/AppContext';

export default function Sizes() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [tops, setTops] = useState<string>();
  const [outerwear, setOuterwear] = useState<string>();
  const [pants, setPants] = useState<string>();
  const [shoes, setShoes] = useState<string>();

  return (
    <OnboardingScaffold
      step={5}
      total={8}
      title="What are your sizes?"
      subtitle="Our bodies are unique! Add as much info as you like!"
      onNext={() => {
        setOnboarding({ sizes: { tops, outerwear, pants, shoes } });
        router.push('/(onboarding)/brands');
      }}
    >
      <SelectField label="Tops" placeholder="Selection" value={tops} options={sizeOptions.tops} onChange={setTops} />
      <SelectField label="Outerwear" placeholder="Selection" value={outerwear} options={sizeOptions.outerwear} onChange={setOuterwear} />
      <SelectField label="Pants" placeholder="Selection" value={pants} options={sizeOptions.pants} onChange={setPants} />
      <SelectField label="Shoes" placeholder="Selection" value={shoes} options={sizeOptions.shoes} onChange={setShoes} />
    </OnboardingScaffold>
  );
}
