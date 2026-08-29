import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Post } from '../constants/data';
import { colors, font, radius, spacing } from '../constants/theme';
import { Avatar, ImageTile, Tag } from './ui';

interface PostCardProps {
  post: Post;
  showCircle?: boolean;
  onPress?: () => void;
  onCirclePress?: () => void;
  onLikesPress?: () => void;
  onRepliesPress?: () => void;
}

export function PostCard({
  post,
  showCircle = true,
  onPress,
  onCirclePress,
  onLikesPress,
  onRepliesPress,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {showCircle ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onCirclePress?.();
          }}
        >
          <Text style={styles.circle}>{post.circle}</Text>
        </Pressable>
      ) : null}

      <View style={styles.headRow}>
        <Avatar name={post.author.replace('@', '')} size={36} />
        <View style={styles.headInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.author}>{post.author}</Text>
            <Text style={styles.match}>{post.match}% match</Text>
          </View>
          <View style={styles.tagsRow}>
            {post.tags.map((t, i) => (
              <Tag key={i} label={t} />
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.body}>{post.body}</Text>

      {post.product ? (
        <View style={styles.productCard}>
          <ImageTile size={56} icon="shirt-outline" />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={styles.productBrand}>{post.product.brand}</Text>
            <Text style={styles.productName}>{post.product.name}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        {post.replies.length ? (
          <Pressable
            style={styles.footerItem}
            onPress={(e) => {
              e.stopPropagation?.();
              onRepliesPress?.();
            }}
          >
            <View style={styles.replyAvatars}>
              <View style={[styles.miniAvatar, { zIndex: 2 }]} />
              <View style={[styles.miniAvatar, { marginLeft: -8, zIndex: 1 }]} />
            </View>
            <Text style={styles.footerText}>{post.replies.length}+ Replies</Text>
          </Pressable>
        ) : null}
        <Pressable
          style={styles.footerItem}
          onPress={(e) => {
            e.stopPropagation?.();
            setLiked((v) => !v);
          }}
          onLongPress={() => onLikesPress?.()}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={16}
            color={liked ? colors.danger : colors.textMuted}
          />
          <Pressable onPress={() => onLikesPress?.()}>
            <Text style={styles.footerText}>{likeCount} likes</Text>
          </Pressable>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  circle: {
    ...font.tiny,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  headRow: { flexDirection: 'row', alignItems: 'center' },
  headInfo: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  author: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', gap: 4 },
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
  footer: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md, alignItems: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { ...font.tiny, color: colors.textMuted, fontWeight: '600' },
  replyAvatars: { flexDirection: 'row', marginRight: 2 },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.fillDeep,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
