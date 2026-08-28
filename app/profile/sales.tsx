import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { OrderCard } from '../../components/OrderCard';
import { sales } from '../../constants/data';
import { colors, spacing } from '../../constants/theme';

export default function Sales() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="My Sales" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View>
          {sales.map((o) => (
            <OrderCard key={o.id} order={o} type="sale" />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
});
