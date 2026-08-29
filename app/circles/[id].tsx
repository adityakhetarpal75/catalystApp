import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { circles, posts } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function CircleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState('');

  const circle = circles.find((c) => c.id === id);
  const name = circle?.name || `#${id}`;
  const members = circle?.members || 100;
  const feed = posts;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.members}>{members} members</Text>
        </View>
        <Pressable hitSlop={10}>
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {feed.map((post, idx) => (
            <View key={post.id}>
              {idx === 0 || feed[idx - 1].date !== post.date ? (
                post.date ? (
                  <View style={styles.dateRow}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateText}>{post.date}</Text>
                    <View style={styles.dateLine} />
                  </View>
                ) : null
              ) : null}
              <PostCard
                post={post}
                showCircle={false}
                onPress={() => router.push({ pathname: '/circles/thread', params: { id: post.id } })}
                onLikesPress={() => router.push('/circles/likes')}
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
          <Pressable style={styles.send} onPress={() => setDraft('')}>
            <Ionicons name="send" size={18} color={draft ? colors.ink : colors.textFaint} />
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
  headerCenter: { alignItems: 'center' },
  title: { ...font.h3, color: colors.text },
  members: { ...font.tiny, color: colors.textMuted },
  scroll: { padding: spacing.xl },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
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
