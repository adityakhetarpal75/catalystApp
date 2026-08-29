import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostCard } from '../../components/PostCard';
import { circles } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function CircleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { feedPosts, addFeedPost, profile } = useApp();
  const { user } = useAuth();
  const [draft, setDraft] = useState('');

  const circle = circles.find((c) => c.id === id || c.name.replace(/^#/, '') === id);
  const name = circle?.name || `#${id}`;
  const members = circle?.members || 100;

  const feed = useMemo(() => {
    const key = (circle?.name || `#${id}`).toLowerCase();
    const idKey = (id || '').toLowerCase();
    return feedPosts.filter((p) => {
      const circleKey = p.circle.toLowerCase().replace(/^#/, '');
      return (
        p.circle.toLowerCase() === key ||
        circleKey === idKey ||
        circleKey.replace(/_/g, '-') === idKey.replace(/_/g, '-')
      );
    });
  }, [feedPosts, circle?.name, id]);

  const publish = () => {
    const body = draft.trim();
    if (!body) return;
    addFeedPost({
      id: `local-${Date.now()}`,
      circle: name,
      author: `@${user?.username || profile.username || 'you'}`,
      match: 92,
      tags: ['You'],
      body,
      likes: 0,
      replies: [],
      date: 'Today',
    });
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.members}>{members} members</Text>
        </View>
        <Pressable hitSlop={10} onPress={() => router.push('/circles/explore')}>
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {feed.length === 0 ? (
            <Text style={styles.empty}>No posts in this circle yet. Be the first!</Text>
          ) : null}
          {feed.map((post, idx) => (
            <View key={post.id}>
              {idx === 0 || feed[idx - 1].date !== post.date
                ? post.date
                  ? (
                      <View style={styles.dateRow}>
                        <View style={styles.dateLine} />
                        <Text style={styles.dateText}>{post.date}</Text>
                        <View style={styles.dateLine} />
                      </View>
                    )
                  : null
                : null}
              <PostCard
                post={post}
                showCircle={false}
                onPress={() =>
                  router.push({ pathname: '/circles/thread', params: { id: post.id } })
                }
                onLikesPress={() => router.push('/circles/likes')}
                onRepliesPress={() =>
                  router.push({ pathname: '/circles/thread', params: { id: post.id } })
                }
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Add a post here"
            placeholderTextColor={colors.textFaint}
            value={draft}
            onChangeText={setDraft}
          />
          <Pressable style={styles.send} onPress={publish}>
            <Ionicons name="send" size={18} color={draft.trim() ? colors.ink : colors.textFaint} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: { alignItems: 'center', flex: 1, paddingHorizontal: spacing.sm },
  title: { ...font.h3, color: colors.text },
  members: { ...font.tiny, color: colors.textMuted },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxl },
  empty: { ...font.small, color: colors.textMuted, textAlign: 'center', marginVertical: spacing.xxl },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  dateLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dateText: { ...font.tiny, color: colors.textMuted, fontWeight: '600' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.canvas,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 44,
    ...font.body,
    color: colors.text,
  },
  send: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
