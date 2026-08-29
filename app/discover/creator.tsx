import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { beautyProducts, creators, routineSteps } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function CreatorCabinet() {
  const router = useRouter();
  const creator = creators[0];
  const [tab, setTab] = useState<'cabinet' | 'videos'>('cabinet');
  const [following, setFollowing] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.headerBg}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <Pressable
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={() => setFollowing((v) => !v)}
          >
            <Text style={[styles.followText, following && styles.followingText]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={34} color={colors.onDarkFaint} />
            </View>
            <View style={styles.creatorBadge}>
              <Text style={styles.creatorBadgeText}>+ Creator</Text>
            </View>
          </View>

          <Text style={styles.handle}>{creator.handle}</Text>
          <Text style={styles.match}>{creator.match}% match</Text>

          <View style={styles.stats}>
            <Stat value={String(creator.products)} label="Products" />
            <Stat value={String(creator.videos)} label="Videos" />
            <Stat value={String(creator.following)} label="Following" />
          </View>

          <View style={styles.tags}>
            {creator.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.onDarkMuted} />
            <Text style={styles.location}>{creator.location}</Text>
          </View>
          <Text style={styles.bio}>{creator.bio}</Text>

          <View style={styles.segment}>
            <Pressable
              style={[styles.seg, tab === 'cabinet' && styles.segActive]}
              onPress={() => setTab('cabinet')}
            >
              <Ionicons
                name="grid-outline"
                size={16}
                color={tab === 'cabinet' ? colors.white : colors.onDarkFaint}
              />
              <Text style={[styles.segText, tab === 'cabinet' && styles.segTextActive]}>
                My Cabinet
              </Text>
            </Pressable>
            <Pressable
              style={[styles.seg, tab === 'videos' && styles.segActive]}
              onPress={() => setTab('videos')}
            >
              <Ionicons
                name="videocam-outline"
                size={16}
                color={tab === 'videos' ? colors.white : colors.onDarkFaint}
              />
              <Text style={[styles.segText, tab === 'videos' && styles.segTextActive]}>
                My Videos
              </Text>
            </Pressable>
          </View>

          {tab === 'cabinet' ? (
            <>
              <Text style={styles.sectionTitle}>Routines</Text>
              <View style={styles.routineCard}>
                <View style={styles.routineHead}>
                  <Text style={styles.routineTitle}>AM Routine</Text>
                  <View style={styles.stepsBadge}>
                    <Text style={styles.stepsBadgeText}>{routineSteps.length} Steps</Text>
                  </View>
                </View>
                <Text style={styles.routineSub}>
                  "This is my go-to AM routine for addressing acne."
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.routineSteps}
                >
                  {routineSteps.map((s) => (
                    <View key={s.step} style={styles.stepWrap}>
                      <View style={styles.stepImg}>
                        <Ionicons name="cube-outline" size={18} color={colors.onDarkFaint} />
                        <View style={styles.stepNum}>
                          <Text style={styles.stepNumText}>{s.step}</Text>
                        </View>
                      </View>
                      <Text style={styles.stepName} numberOfLines={2}>
                        {s.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.sectionTitle}>On the shelf</Text>
              <View style={styles.grid}>
                {beautyProducts.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.shelfCard}
                    onPress={() =>
                      router.push({ pathname: '/discover/brand', params: { name: p.brand } })
                    }
                  >
                    <View style={styles.shelfImg}>
                      <Ionicons name="cube-outline" size={24} color={colors.onDarkFaint} />
                    </View>
                    <Text style={styles.shelfBrand}>{p.brand}</Text>
                    <Text style={styles.shelfName} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.grid}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.videoCard}>
                  <View style={styles.playBtn}>
                    <Ionicons name="play" size={16} color={colors.white} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  headerBg: {
    height: 120,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  followingBtn: { backgroundColor: 'rgba(0,0,0,0.25)' },
  followText: { ...font.small, color: colors.ink, fontWeight: '700' },
  followingText: { color: colors.white },
  body: { paddingHorizontal: spacing.xl, marginTop: -34 },
  avatarRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.darkElevated,
    borderWidth: 3,
    borderColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorBadge: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  creatorBadgeText: { ...font.tiny, color: colors.white, fontWeight: '800' },
  handle: { ...font.h3, color: colors.onDarkText, marginTop: spacing.md },
  match: { ...font.small, color: colors.coral, fontWeight: '700', marginTop: 2 },
  stats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  stat: { alignItems: 'flex-start' },
  statValue: { ...font.bodyStrong, color: colors.onDarkText },
  statLabel: { ...font.tiny, color: colors.onDarkFaint, marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  tag: {
    backgroundColor: colors.darkElevated,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  tagText: { ...font.tiny, color: colors.onDarkMuted },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md },
  location: { ...font.tiny, color: colors.onDarkMuted },
  bio: { ...font.small, color: colors.onDarkMuted, marginTop: spacing.sm, lineHeight: 19 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.darkSurface,
    borderRadius: radius.md,
    padding: 4,
    marginTop: spacing.xl,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  segActive: { backgroundColor: colors.coral },
  segText: { ...font.small, color: colors.onDarkFaint, fontWeight: '600' },
  segTextActive: { color: colors.white },
  sectionTitle: {
    ...font.h3,
    color: colors.onDarkText,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  routineCard: {
    backgroundColor: colors.darkSurface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  routineHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineTitle: { ...font.bodyStrong, color: colors.onDarkText },
  stepsBadge: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  stepsBadgeText: { ...font.tiny, color: colors.white, fontWeight: '700' },
  routineSub: { ...font.small, color: colors.onDarkMuted, marginTop: spacing.sm },
  routineSteps: { gap: spacing.md, marginTop: spacing.md, paddingRight: spacing.md },
  stepWrap: { width: 72 },
  stepImg: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { ...font.tiny, color: colors.white, fontWeight: '800' },
  stepName: { ...font.tiny, color: colors.onDarkMuted, marginTop: 6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  shelfCard: { width: '48%', marginBottom: spacing.lg },
  shelfImg: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  shelfBrand: {
    ...font.tiny,
    color: colors.onDarkFaint,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  shelfName: { ...font.small, color: colors.onDarkText, fontWeight: '600', marginTop: 2 },
  videoCard: {
    width: '31%',
    aspectRatio: 0.7,
    borderRadius: radius.md,
    backgroundColor: colors.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
