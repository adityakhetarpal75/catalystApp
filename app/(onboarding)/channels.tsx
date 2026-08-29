import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingScaffold } from '../../components/OnboardingScaffold';
import { channels } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Channels() {
  const router = useRouter();
  const { setOnboarding } = useApp();
  const { completeOnboarding } = useAuth();
  const [joined, setJoined] = useState<string[]>([]);

  const toggle = (name: string) =>
    setJoined((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const finish = async () => {
    setOnboarding({ channels: joined });
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <OnboardingScaffold
      step={8}
      total={8}
      title="Join channels"
      subtitle="Join our curated channels to hang out with community and chat about thrifting."
      showSkip
      onSkip={finish}
      onNext={finish}
      nextLabel="Finish"
    >
      {channels.map((c) => {
        const isJoined = joined.includes(c.name);
        return (
          <View key={c.name} style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name="chatbubbles-outline" size={20} color={colors.textMuted} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.desc} numberOfLines={1}>
                {c.desc}
              </Text>
            </View>
            <Pressable
              style={[styles.joinBtn, isJoined && styles.joinedBtn]}
              onPress={() => toggle(c.name)}
            >
              <Text style={[styles.joinText, isJoined && styles.joinedText]}>
                {isJoined ? 'Joined' : 'Join'}
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...font.bodyStrong, color: colors.text, textTransform: 'uppercase', letterSpacing: 0.3 },
  desc: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  joinBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  joinedBtn: { backgroundColor: colors.ink },
  joinText: { ...font.small, color: colors.ink, fontWeight: '700' },
  joinedText: { color: colors.white },
});
