import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { TabBar } from '../../components/TabBar';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (user && !user.onboardingComplete) {
    return <Redirect href="/(onboarding)/personal-info" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...(props as unknown as React.ComponentProps<typeof TabBar>)} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="closet" options={{ title: 'Cabinet' }} />
      <Tabs.Screen name="channels" options={{ title: 'Channels' }} />
    </Tabs>
  );
}
