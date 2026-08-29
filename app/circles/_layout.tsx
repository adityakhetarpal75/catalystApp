import { Stack } from 'expo-router';
import React from 'react';

export default function CirclesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="thread" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="likes" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="add-products" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
