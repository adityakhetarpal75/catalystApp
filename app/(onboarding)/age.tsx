import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../context/AppContext';
import { spacing } from '../../constants/theme';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Age() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [month, setMonth] = useState<string>();
  const [day, setDay] = useState<string>();
  const [year, setYear] = useState<string>();

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1)), []);
  const years = useMemo(
    () => Array.from({ length: 70 }, (_, i) => String(new Date().getFullYear() - 16 - i)),
    []
  );

  return (
    <OnboardingScaffold
      step={2}
      total={8}
      title="What’s your age?"
      subtitle="Pick your birth date!"
      nextDisabled={!month || !day || !year}
      onNext={() => {
        setOnboarding({ birthday: `${month} ${day}, ${year}` });
        router.push('/(onboarding)/style');
      }}
    >
      <View style={styles.card}>
        <SelectField label="Month" placeholder="Select month" value={month} options={months} onChange={setMonth} />
        <SelectField label="Day" placeholder="Select day" value={day} options={days} onChange={setDay} />
        <SelectField label="Year" placeholder="Select year" value={year} options={years} onChange={setYear} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
});
