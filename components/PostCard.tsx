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
  onLikesPress?: () => void;
}

export function PostCard({ post, showCircle = true, onPress, onLikesPress }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {showCircle ? <Text style={styles.circle}>{post.circle}</Text> : null}
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
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.productBrand}>{post.product.brand}</Text>
            <Text style={styles.productName}>{post.product.name}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        {post.replies.length ? (
          <View style={styles.footerItem}>
            <Ionicons name="chatbubble-outline" size={15} color={colors.textMuted} />
            <Text style={styles.footerText}>{post.replies.length}+ Replies</Text>
          </View>
        ) : null}
        <Pressable
          style={styles.footerItem}
          onPress={() => setLiked((v) => !v)}
          onLongPress={onLikesPress}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={16}
            color={liked ? colors.danger : colors.textMuted}
          />
          <Text style={styles.footerText}>{likeCount} likes</Text>
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
  circle: { ...font.tiny, color: colors.textMuted, fontWeight: '700', marginBottom: spacing.sm },
  headRow: { flexDirection: 'row', alignItems: 'center' },
  headInfo: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  author: { ...font.bodyStrong, color: colors.text },
  match: { ...font.tiny, color: colors.success, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', marginTop: 4 },
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
  productBrand: { ...font.tiny, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  productName: { ...font.bodyStrong, color: colors.text, marginTop: 2 },
  footer: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { ...font.tiny, color: colors.textMuted, fontWeight: '600' },
});
