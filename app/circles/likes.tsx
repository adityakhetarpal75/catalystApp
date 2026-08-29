import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Tag } from '../../components/ui';
import { postLikers } from '../../constants/data';
import { colors, font, spacing } from '../../constants/theme';

export default function Likes() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={18} color={colors.danger} />
          <Text style={styles.title}>Likes</Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {postLikers.map((u, i) => (
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
            <Pressable style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...font.h3, color: colors.text },
  scroll: { padding: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  info: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  tags: { flexDirection: 'row', marginTop: 4 },
  followBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999, borderWidth: 1, borderColor: colors.ink },
  followText: { ...font.small, color: colors.ink, fontWeight: '700' },
});
