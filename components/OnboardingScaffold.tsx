import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { colors, font, spacing } from '../constants/theme';

interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function OnboardingScaffold({
  step,
  total,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = 'Next',
  nextDisabled,
  showSkip,
  onSkip,
}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        showBack
        right={
          showSkip ? (
            <Pressable onPress={onSkip} hitSlop={10}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : undefined
        }
      />
      <View style={styles.progress}>
        <ProgressBar step={step} total={total} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.content}>{children}</View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={nextLabel} onPress={onNext} disabled={nextDisabled} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  progress: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  title: { ...font.h1, color: colors.text, lineHeight: 34 },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 21 },
  content: { marginTop: spacing.xl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  skip: { ...font.bodyStrong, color: colors.textMuted },
});
