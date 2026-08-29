import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { PostCard } from '../../components/PostCard';
import { ImageTile } from '../../components/ui';
import { circles, posts } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

type Sort = 'new' | 'trending';

export default function Channels() {
  const router = useRouter();
  const { channelsIntroSeen, markChannelsIntroSeen, joinedCircles, toggleCircle } = useApp();
  const [showIntro, setShowIntro] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<Sort>('trending');

  useEffect(() => {
    if (!channelsIntroSeen) setShowIntro(true);
  }, [channelsIntroSeen]);

  const dismissIntro = () => {
    markChannelsIntroSeen();
    setShowIntro(false);
  };

  const suggested = circles.filter((c) => !joinedCircles.includes(c.id)).slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setShowPanel(true)} hitSlop={10}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={() => setShowSort(true)} hitSlop={10}>
            <Ionicons name="filter" size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/circles/explore')} hitSlop={10}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>{sort === 'trending' ? 'Most liked' : 'Most recent'}</Text>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => router.push({ pathname: '/circles/[id]', params: { id: post.circle.replace('#', '') } })}
            onLikesPress={() => router.push('/circles/likes')}
          />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Suggested circles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggested.map((c) => (
            <View key={c.id} style={styles.suggCard}>
              <ImageTile size={40} icon="people-outline" />
              <Text style={styles.suggName}>{c.name}</Text>
              <Text style={styles.suggMembers}>{c.members} members</Text>
              <Pressable style={styles.joinBtn} onPress={() => toggleCircle(c.id)}>
                <Text style={styles.joinText}>Join</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* First-time welcome sheet */}
      <Modal visible={showIntro} transparent animationType="fade" onRequestClose={dismissIntro}>
        <View style={styles.introBackdrop}>
          <View style={styles.introCard}>
            <ImageTile size={72} icon="people-circle-outline" style={{ marginBottom: spacing.lg }} />
            <Text style={styles.introTitle}>Thrifting is done best with the community!</Text>
            <Text style={styles.introBody}>
              Join circles to seek answers, start your own circles, connect with fellow thrifters or lurk
              around to experience the community!
            </Text>
            <Button label="Go To Feed" onPress={dismissIntro} style={{ marginTop: spacing.xl }} />
            <Button
              label="Explore Circles"
              variant="secondary"
              style={{ marginTop: spacing.md }}
              onPress={() => {
                dismissIntro();
                router.push('/circles/explore');
              }}
            />
          </View>
        </View>
      </Modal>

      {/* My Circles side panel */}
      <Modal visible={showPanel} transparent animationType="slide" onRequestClose={() => setShowPanel(false)}>
        <View style={styles.panelRow}>
          <View style={styles.panel}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <Text style={styles.panelTitle}>Circles</Text>
              <Pressable style={styles.backToFeed} onPress={() => setShowPanel(false)}>
                <Ionicons name="arrow-back" size={16} color={colors.onDarkText} />
                <Text style={styles.backToFeedText}>Go back to Feed</Text>
              </Pressable>

              <View style={styles.panelHead}>
                <Text style={styles.panelHeadText}>My circles</Text>
                <Pressable onPress={() => { setShowPanel(false); router.push('/circles/explore'); }}>
                  <Ionicons name="add" size={22} color={colors.onDarkText} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {circles
                  .filter((c) => joinedCircles.includes(c.id))
                  .map((c) => (
                    <Pressable
                      key={c.id}
                      style={styles.panelItem}
                      onPress={() => {
                        setShowPanel(false);
                        router.push({ pathname: '/circles/[id]', params: { id: c.id } });
                      }}
                    >
                      <Text style={styles.panelItemName}>{c.name}</Text>
                      <Text style={styles.panelItemMembers}>{c.members} members</Text>
                    </Pressable>
                  ))}
              </ScrollView>
            </SafeAreaView>
          </View>
          <Pressable style={styles.panelDismiss} onPress={() => setShowPanel(false)} />
        </View>
      </Modal>

      {/* Sort sheet */}
      <Modal visible={showSort} transparent animationType="fade" onRequestClose={() => setShowSort(false)}>
        <Pressable style={styles.sortBackdrop} onPress={() => setShowSort(false)}>
          <View style={styles.sortSheet}>
            <View style={styles.grabber} />
            <Text style={styles.sortTitle}>Sort by</Text>
            <SortOption icon="time-outline" label="What’s New" active={sort === 'new'} onPress={() => { setSort('new'); setShowSort(false); }} />
            <SortOption icon="heart-outline" label="What’s Trending" active={sort === 'trending'} onPress={() => { setSort('trending'); setShowSort(false); }} />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SortOption({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.sortOption} onPress={onPress}>
      <Ionicons name={icon} size={20} color={active ? colors.ink : colors.textMuted} />
      <Text style={[styles.sortLabel, active && { color: colors.ink, fontWeight: '700' }]}>{label}</Text>
      {active ? <Ionicons name="checkmark" size={18} color={colors.ink} style={{ marginLeft: 'auto' }} /> : null}
    </Pressable>
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
  title: { ...font.h3, color: colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  scroll: { padding: spacing.xl },
  sectionLabel: { ...font.bodyStrong, color: colors.text, marginBottom: spacing.md },
  suggCard: {
    width: 150,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  suggName: { ...font.bodyStrong, color: colors.text, marginTop: spacing.sm },
  suggMembers: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  joinBtn: { marginTop: spacing.md, backgroundColor: colors.ink, borderRadius: radius.pill, paddingVertical: spacing.sm, alignItems: 'center' },
  joinText: { ...font.small, color: colors.white, fontWeight: '700' },
  // intro
  introBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  introCard: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xxl, alignItems: 'center', width: '100%', maxWidth: 340 },
  introTitle: { ...font.h2, color: colors.text, textAlign: 'center' },
  introBody: { ...font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 20 },
  // panel
  panelRow: { flex: 1, flexDirection: 'row' },
  panel: { width: '78%', backgroundColor: colors.slate, paddingHorizontal: spacing.xl },
  panelDismiss: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  panelTitle: { ...font.h2, color: colors.onDarkText, marginTop: spacing.md },
  backToFeed: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.slateDeep, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  backToFeedText: { ...font.small, color: colors.onDarkText, fontWeight: '600' },
  panelHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.sm },
  panelHeadText: { ...font.bodyStrong, color: colors.onDarkText },
  panelItem: { backgroundColor: colors.slateDeep, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  panelItemName: { ...font.bodyStrong, color: colors.onDarkText },
  panelItemMembers: { ...font.tiny, color: colors.onDarkMuted, marginTop: 2 },
  // sort
  sortBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sortSheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing.xxxl },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.lg },
  sortTitle: { ...font.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  sortOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  sortLabel: { ...font.body, color: colors.text },
});
