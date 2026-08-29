import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Tag } from '../../components/ui';
import { postLikers } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Likes() {
  const router = useRouter();
  const [following, setFollowing] = useState<string[]>([]);

  const toggle = (name: string) =>
    setFollowing((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={18} color={colors.danger} />
          <Text style={styles.title}>Likes</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {postLikers.map((u, i) => {
          const isFollowing = following.includes(u.author);
          return (
            <View key={i} style={styles.row}>
              <Avatar name={u.author} size={44} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{u.author}</Text>
                  <Text style={styles.match}>{u.match}% match</Text>
                </View>
                <View style={styles.tags}>
                  {u.tags.map((t, k) => (
                    <Tag key={k} label={t} />
                  ))}
                </View>
              </View>
              <Pressable
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => toggle(u.author)}
              >
                <Text style={[styles.followText, isFollowing && styles.followingText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...font.h3, color: colors.text },
  scroll: { padding: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  name: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  tags: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', gap: 4 },
  followBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  followingBtn: { backgroundColor: colors.ink },
  followText: { ...font.small, color: colors.ink, fontWeight: '700' },
  followingText: { color: colors.white },
});
