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
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    feedPosts,
    addReply,
    composeProducts,
    removeComposeProduct,
    clearComposeProducts,
    profile,
  } = useApp();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);

  const post = feedPosts.find((p) => p.id === id) || feedPosts[0];

  const send = () => {
    const body = comment.trim();
    if (!body && composeProducts.length === 0) return;
    const productNote =
      composeProducts.length > 0
        ? `\n\nAttached: ${composeProducts.map((p) => `${p.brand} ${p.name}`).join(', ')}`
        : '';
    addReply(post.id, {
      author: user?.username || profile.username || 'You',
      match: 92,
      tags: ['You'],
      body: `${body}${productNote}`.trim(),
    });
    setComment('');
    clearComposeProducts();
    setExpanded(false);
  };

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
        <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={10}>
          <Ionicons
            name={expanded ? 'contract-outline' : 'expand-outline'}
            size={20}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {!expanded ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
              {post.product ? (
                <View style={styles.productCard}>
                  <ImageTile size={48} icon="shirt-outline" />
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={styles.productBrand}>{post.product.brand}</Text>
                    <Text style={styles.productName}>{post.product.name}</Text>
                  </View>
                </View>
              ) : null}
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
        ) : (
          <View style={styles.expandedCompose}>
            <TextInput
              style={styles.expandedInput}
              placeholder="Comment here"
              placeholderTextColor={colors.textFaint}
              value={comment}
              onChangeText={setComment}
              multiline
              autoFocus
            />
          </View>
        )}

        {composeProducts.length > 0 ? (
          <View style={styles.attachments}>
            {composeProducts.map((p) => (
              <View key={p.id} style={styles.attachTile}>
                <ImageTile size={64} icon="shirt-outline" />
                <Pressable style={styles.attachRemove} onPress={() => removeComposeProduct(p.id)}>
                  <Ionicons name="close" size={12} color={colors.white} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.addProductsBar}>
          <Pressable
            style={styles.addProducts}
            onPress={() => router.push('/circles/add-products')}
          >
            <Ionicons name="add" size={16} color={colors.text} />
            <Text style={styles.addProductsText}>Add products</Text>
          </Pressable>
          <Pressable style={styles.send} onPress={send}>
            <Ionicons
              name="send"
              size={18}
              color={comment.trim() || composeProducts.length ? colors.ink : colors.textFaint}
            />
          </Pressable>
        </View>

        {!expanded ? (
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Comment here"
              placeholderTextColor={colors.textFaint}
              value={comment}
              onChangeText={setComment}
              onFocus={() => setExpanded(true)}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerCenter: { alignItems: 'center' },
  title: { ...font.h3, color: colors.text },
  sub: { ...font.tiny, color: colors.textMuted },
  scroll: { padding: spacing.xl },
  original: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  author: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  matchDim: { ...font.tiny, color: colors.textMuted, fontWeight: '700' },
  tags: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', gap: 4 },
  body: { ...font.small, color: colors.textMuted, lineHeight: 20, marginTop: spacing.md },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  productBrand: {
    ...font.tiny,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productName: { ...font.bodyStrong, color: colors.text, marginTop: 2 },
  repliesLabel: {
    ...font.bodyStrong,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  reply: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replyBody: { ...font.small, color: colors.textMuted, lineHeight: 19, marginTop: spacing.sm },
  expandedCompose: { flex: 1, backgroundColor: colors.white, padding: spacing.xl },
  expandedInput: {
    flex: 1,
    ...font.body,
    color: colors.text,
    textAlignVertical: 'top',
  },
  attachments: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
  },
  attachTile: { position: 'relative' },
  attachRemove: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProductsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  addProducts: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: colors.white,
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
