import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { PostCard } from '../../components/PostCard';
import { circles } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

type Sort = 'new' | 'trending';

export default function Channels() {
  const router = useRouter();
  const { channelsIntroSeen, markChannelsIntroSeen, joinedCircles, toggleCircle, feedPosts } =
    useApp();
  const [showIntro, setShowIntro] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<Sort>('trending');
  const [panelQuery, setPanelQuery] = useState('');

  useEffect(() => {
    if (!channelsIntroSeen) setShowIntro(true);
  }, [channelsIntroSeen]);

  const dismissIntro = () => {
    markChannelsIntroSeen();
    setShowIntro(false);
  };

  const sortedPosts = useMemo(() => {
    const list = [...feedPosts];
    if (sort === 'trending') list.sort((a, b) => b.likes - a.likes);
    else list.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
    return list;
  }, [feedPosts, sort]);

  const suggested = circles.filter((c) => !joinedCircles.includes(c.id)).slice(0, 6);
  const myCircles = circles
    .filter((c) => joinedCircles.includes(c.id))
    .filter((c) => c.name.toLowerCase().includes(panelQuery.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => setShowPanel(true)} hitSlop={10}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={() => setShowSort(true)} hitSlop={10}>
            <Ionicons name="funnel-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/circles/explore')} hitSlop={10}>
            <Ionicons name="search" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>
          {sort === 'trending' ? 'Most liked' : "What's new"}
        </Text>
        {sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() =>
              router.push({ pathname: '/circles/thread', params: { id: post.id } })
            }
            onCirclePress={() =>
              router.push({
                pathname: '/circles/[id]',
                params: { id: post.circle.replace(/^#/, '') },
              })
            }
            onLikesPress={() => router.push('/circles/likes')}
            onRepliesPress={() =>
              router.push({ pathname: '/circles/thread', params: { id: post.id } })
            }
          />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Suggested circles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggested.map((c) => (
            <Pressable
              key={c.id}
              style={styles.suggPill}
              onPress={() => toggleCircle(c.id)}
              onLongPress={() =>
                router.push({ pathname: '/circles/[id]', params: { id: c.id } })
              }
            >
              <Text style={styles.suggName}>{c.name}</Text>
              <Text style={styles.suggMembers}>{c.members} members</Text>
            </Pressable>
          ))}
          <Pressable style={styles.suggExplore} onPress={() => router.push('/circles/explore')}>
            <Text style={styles.suggExploreText}>Explore all →</Text>
          </Pressable>
        </ScrollView>
      </ScrollView>

      {/* Welcome */}
      <Modal visible={showIntro} animationType="fade" onRequestClose={dismissIntro}>
        <SafeAreaView style={styles.introRoot} edges={['top', 'bottom']}>
          <Text style={styles.introWatermark}>Circles</Text>
          <View style={styles.introBody}>
            <View style={styles.greenBubble}>
              <Text style={styles.greenBubbleText}>CIRCLES</Text>
            </View>
            <Text style={styles.introTitle}>Thrifting is done best with the community!</Text>
            <Text style={styles.introCopy}>
              Join circles to seek answers, start your own circles, connect with fellow thrifters or
              lurk around to experience the community!
            </Text>
          </View>
          <View style={styles.introFooter}>
            <Button label="Go To Feed" onPress={dismissIntro} />
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
        </SafeAreaView>
      </Modal>

      {/* Side panel */}
      <Modal visible={showPanel} transparent animationType="slide" onRequestClose={() => setShowPanel(false)}>
        <View style={styles.panelRow}>
          <View style={styles.panel}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <Text style={styles.panelTitle}>Circles</Text>
              <Pressable style={styles.backToFeed} onPress={() => setShowPanel(false)}>
                <Ionicons name="arrow-back" size={16} color={colors.onDarkText} />
                <Text style={styles.backToFeedText}>Go back to Feed</Text>
              </Pressable>

              <View style={styles.panelSearch}>
                <Ionicons name="search" size={16} color={colors.onDarkMuted} />
                <TextInput
                  style={styles.panelSearchInput}
                  placeholder="Go To..."
                  placeholderTextColor={colors.onDarkMuted}
                  value={panelQuery}
                  onChangeText={setPanelQuery}
                />
              </View>

              <View style={styles.panelHead}>
                <Text style={styles.panelHeadText}>My circles</Text>
                <Pressable
                  onPress={() => {
                    setShowPanel(false);
                    router.push('/circles/explore');
                  }}
                >
                  <Ionicons name="add" size={22} color={colors.onDarkText} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {myCircles.map((c) => (
                  <Pressable
                    key={c.id}
                    style={styles.panelItem}
                    onPress={() => {
                      setShowPanel(false);
                      router.push({ pathname: '/circles/[id]', params: { id: c.id } });
                    }}
                  >
                    <View style={styles.panelHash}>
                      <Text style={styles.panelHashText}>#</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.panelItemName}>{c.name}</Text>
                      <Text style={styles.panelItemMembers}>{c.members} members</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </SafeAreaView>
          </View>
          <Pressable style={styles.panelDismiss} onPress={() => setShowPanel(false)} />
        </View>
      </Modal>

      {/* Sort */}
      <Modal visible={showSort} transparent animationType="fade" onRequestClose={() => setShowSort(false)}>
        <Pressable style={styles.sortBackdrop} onPress={() => setShowSort(false)}>
          <View style={styles.sortSheet}>
            <View style={styles.grabber} />
            <Text style={styles.sortTitle}>Sort by</Text>
            <SortOption
              icon="time-outline"
              label="What's New"
              active={sort === 'new'}
              onPress={() => {
                setSort('new');
                setShowSort(false);
              }}
            />
            <SortOption
              icon="heart-outline"
              label="What's Trending"
              active={sort === 'trending'}
              onPress={() => {
                setSort('trending');
                setShowSort(false);
              }}
            />
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
      <Text style={[styles.sortLabel, active && { color: colors.ink, fontWeight: '700' }]}>
        {label}
      </Text>
      {active ? (
        <Ionicons name="checkmark" size={18} color={colors.ink} style={{ marginLeft: 'auto' }} />
      ) : null}
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
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: { ...font.bodyStrong, color: colors.text, marginBottom: spacing.md },
  suggPill: {
    backgroundColor: colors.canvas,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    minWidth: 120,
  },
  suggName: { ...font.bodyStrong, color: colors.text },
  suggMembers: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  suggExplore: {
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  suggExploreText: { ...font.small, color: colors.textMuted, fontWeight: '700' },
  introRoot: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.xl },
  introWatermark: {
    ...font.h1,
    color: colors.border,
    fontSize: 42,
    marginTop: spacing.lg,
  },
  introBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.xxxl },
  greenBubble: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  greenBubbleText: {
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.ink,
    letterSpacing: 1,
  },
  introTitle: { ...font.h2, color: colors.text, textAlign: 'center', lineHeight: 30 },
  introCopy: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  introFooter: { paddingBottom: spacing.lg },
  panelRow: { flex: 1, flexDirection: 'row' },
  panel: { width: '82%', backgroundColor: colors.slate, paddingHorizontal: spacing.xl },
  panelDismiss: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  panelTitle: { ...font.h2, color: colors.onDarkText, marginTop: spacing.md },
  backToFeed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.slateDeep,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
  },
  backToFeedText: { ...font.small, color: colors.onDarkText, fontWeight: '600' },
  panelSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.slateDeep,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    marginTop: spacing.lg,
  },
  panelSearchInput: { flex: 1, ...font.body, color: colors.onDarkText },
  panelHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  panelHeadText: { ...font.bodyStrong, color: colors.onDarkText },
  panelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.slateDeep,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  panelHash: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelHashText: { color: colors.onDarkText, fontWeight: '800' },
  panelItemName: { ...font.bodyStrong, color: colors.onDarkText },
  panelItemMembers: { ...font.tiny, color: colors.onDarkMuted, marginTop: 2 },
  sortBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sortSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  sortTitle: { ...font.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  sortOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  sortLabel: { ...font.body, color: colors.text },
});
