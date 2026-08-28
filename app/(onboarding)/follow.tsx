import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { Avatar } from '../../components/ui';
import { thrifters } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Follow() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const [following, setFollowing] = useState<string[]>([]);

  const toggle = (h: string) =>
    setFollowing((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

  const next = () => {
    setOnboarding({ following });
    router.push('/(onboarding)/channels');
  };

  return (
    <OnboardingScaffold
      step={7}
      total={8}
      title="Follow fellow thrifters in your city!"
      subtitle="The percentage shows how well you match! We did the work for you ✨"
      showSkip
      onSkip={next}
      onNext={next}
    >
      {thrifters.map((t) => {
        const isFollowing = following.includes(t.handle);
        return (
          <View key={t.handle} style={styles.row}>
            <Avatar name={t.handle.replace('@', '')} size={48} />
            <View style={styles.info}>
              <Text style={styles.handle}>{t.handle}</Text>
              <Text style={styles.bio} numberOfLines={1}>
                {t.bio}
              </Text>
              <Text style={styles.match}>{t.match}% match</Text>
            </View>
            <Pressable
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={() => toggle(t.handle)}
            >
              <Text style={[styles.followText, isFollowing && styles.followingText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, marginLeft: spacing.md },
  handle: { ...font.bodyStrong, color: colors.text },
  bio: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  match: { ...font.tiny, color: colors.success, fontWeight: '700', marginTop: 4 },
  followBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  followingBtn: { backgroundColor: colors.fill },
  followText: { ...font.small, color: colors.white, fontWeight: '700' },
  followingText: { color: colors.text },
});
