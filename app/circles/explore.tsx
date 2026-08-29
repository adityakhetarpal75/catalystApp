import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { ImageTile } from '../../components/ui';
import { circles } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function ExploreCircles() {
  const { joinedCircles, toggleCircle } = useApp();
  const [query, setQuery] = useState('');

  const list = useMemo(
    () => circles.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Join Circles" />
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {list.map((c) => {
          const joined = joinedCircles.includes(c.id);
          return (
            <View key={c.id} style={styles.row}>
              <ImageTile size={40} icon="people-outline" />
              <View style={styles.info}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.members}>{c.members} members</Text>
              </View>
              <Pressable
                style={[styles.btn, joined ? styles.btnJoined : styles.btnJoin]}
                onPress={() => toggleCircle(c.id)}
              >
                <Text style={[styles.btnText, joined ? styles.btnTextJoined : styles.btnTextJoin]}>
                  {joined ? 'Joined' : 'Join'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...font.body, color: colors.text },
  scroll: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...font.bodyStrong, color: colors.text },
  members: { ...font.tiny, color: colors.textMuted, marginTop: 2 },
  btn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, minWidth: 78, alignItems: 'center' },
  btnJoin: { borderWidth: 1, borderColor: colors.ink },
  btnJoined: { backgroundColor: colors.ink },
  btnText: { ...font.small, fontWeight: '700' },
  btnTextJoin: { color: colors.ink },
  btnTextJoined: { color: colors.white },
});
