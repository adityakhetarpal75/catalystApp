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
import { Avatar, ImageTile, Tag } from '../../components/ui';
import { posts } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [comment, setComment] = useState('');

  const post = posts.find((p) => p.id === id) || posts[0];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Thread</Text>
          <Text style={styles.sub}>{post.circle}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Original post */}
          <View style={styles.original}>
            <View style={styles.row}>
              <Avatar name={post.author.replace('@', '')} size={36} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.author}>{post.author}</Text>
                  <Text style={styles.match}>{post.match}% match</Text>
                </View>
                <View style={styles.tags}>
                  {post.tags.map((t, i) => (
                    <Tag key={i} label={t} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.body}>{post.body}</Text>
          </View>

          <Text style={styles.repliesLabel}>Replies</Text>
          {post.replies.map((r, i) => (
            <View key={i} style={styles.reply}>
              <Avatar name={r.author} size={30} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.author}>{r.author}</Text>
                  <Text style={styles.matchDim}>{r.match}% match</Text>
                </View>
                <View style={styles.tags}>
                  {r.tags.map((t, k) => (
                    <Tag key={k} label={t} />
                  ))}
                </View>
                <Text style={styles.replyBody}>{r.body}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.addProductsBar}>
          <Pressable style={styles.addProducts} onPress={() => router.push('/circles/add-products')}>
            <Ionicons name="add" size={16} color={colors.text} />
            <Text style={styles.addProductsText}>Add products</Text>
          </Pressable>
        </View>

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Comment here"
            placeholderTextColor={colors.textFaint}
            value={comment}
            onChangeText={setComment}
          />
          <Pressable style={styles.send} onPress={() => setComment('')}>
            <Ionicons name="send" size={18} color={comment ? colors.ink : colors.textFaint} />
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
  sub: { ...font.tiny, color: colors.textMuted },
  scroll: { padding: spacing.xl },
  original: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, paddingBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  author: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  matchDim: { ...font.tiny, color: colors.textMuted, fontWeight: '700' },
  tags: { flexDirection: 'row', marginTop: 4 },
  body: { ...font.small, color: colors.textMuted, lineHeight: 20, marginTop: spacing.md },
  repliesLabel: { ...font.bodyStrong, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  reply: { flexDirection: 'row', marginBottom: spacing.lg },
  replyBody: { ...font.small, color: colors.textMuted, lineHeight: 19, marginTop: spacing.sm },
  addProductsBar: { paddingHorizontal: spacing.xl },
  addProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: spacing.sm,
  },
  addProductsText: { ...font.small, color: colors.text, fontWeight: '600' },
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
