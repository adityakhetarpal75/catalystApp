import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

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
  const [open, setOpen] = useState(false);

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1)), []);
  const years = useMemo(
    () => Array.from({ length: 70 }, (_, i) => String(new Date().getFullYear() - 16 - i)),
    []
  );

  const summary = month && day && year ? `${month} ${day}, ${year}` : null;

  return (
    <OnboardingScaffold
      step={2}
      total={8}
      title="What's your age?"
      subtitle="Pick your birth date!"
      nextDisabled={!month || !day || !year}
      onNext={() => {
        setOnboarding({ birthday: summary || undefined });
        router.push('/(onboarding)/style');
      }}
    >
      <Pressable style={styles.pickerWell} onPress={() => setOpen((v) => !v)}>
        <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
        <Text style={styles.pickerLabel}>{summary || 'PICK'}</Text>
        <Text style={styles.pickerHint}>
          {summary ? 'Tap to edit' : 'Tap to choose your birth date'}
        </Text>
      </Pressable>

      {open ? (
        <View style={styles.fields}>
          <SelectField label="Month" placeholder="Select month" value={month} options={months} onChange={setMonth} />
          <SelectField label="Day" placeholder="Select day" value={day} options={days} onChange={setDay} />
          <SelectField label="Year" placeholder="Select year" value={year} options={years} onChange={setYear} />
        </View>
      ) : null}
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  pickerWell: {
    height: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  pickerLabel: {
    marginTop: spacing.md,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  pickerHint: { ...font.small, color: colors.textFaint, marginTop: spacing.sm },
  fields: { marginTop: spacing.xl },
});
