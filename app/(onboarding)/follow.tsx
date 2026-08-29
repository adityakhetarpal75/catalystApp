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
      subtitle="The percentage shows how well you match! We did the work for you 👀"
      showSkip
      onSkip={next}
      onNext={next}
    >
      {thrifters.map((t) => {
        const isFollowing = following.includes(t.handle);
        return (
          <Pressable
            key={t.handle}
            style={[styles.card, isFollowing && styles.cardActive]}
            onPress={() => toggle(t.handle)}
          >
            <Avatar name={t.handle.replace('@', '')} size={48} />
            <View style={styles.info}>
              <Text style={styles.handle}>{t.handle.toUpperCase()}</Text>
              <Text style={styles.bio} numberOfLines={1}>
                {t.bio}
              </Text>
              <Text style={styles.match}>{t.match}% match</Text>
            </View>
            <View style={[styles.followBtn, isFollowing && styles.followingBtn]}>
              <Text style={[styles.followText, isFollowing && styles.followingText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  cardActive: { borderColor: colors.ink, borderWidth: 2 },
  info: { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  handle: { ...font.small, color: colors.text, fontWeight: '800', letterSpacing: 0.2 },
  bio: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  match: { ...font.tiny, color: colors.textMuted, fontWeight: '700', marginTop: 4 },
  followBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.white,
  },
  followingBtn: { backgroundColor: colors.ink },
  followText: { ...font.small, color: colors.ink, fontWeight: '700' },
  followingText: { color: colors.white },
});
