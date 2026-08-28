import React, { createContext, useContext, useMemo, useState } from 'react';
import { ClosetItem, closetItems as seedItems } from '../constants/data';

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  location: string;
  email: string;
}

interface OnboardingState {
  identities: string[];
  birthday?: string;
  style?: string;
  goals: string[];
  sizes: { tops?: string; outerwear?: string; pants?: string; shoes?: string };
  brands: string[];
  following: string[];
  channels: string[];
}

interface AppState {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  onboarding: OnboardingState;
  setOnboarding: (o: Partial<OnboardingState>) => void;
  items: ClosetItem[];
  addItem: (item: ClosetItem) => void;
  removeItem: (id: string) => void;
  wishlist: ClosetItem[];
  toggleWishlist: (item: ClosetItem) => void;
  sellEnabled: boolean;
  rentEnabled: boolean;
  setSellEnabled: (v: boolean) => void;
  setRentEnabled: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile>({
    firstName: 'Julia',
    lastName: 'Jess',
    username: 'Zara',
    bio: 'Vintage lover • thrifting since 2015 • sustainable style advocate.',
    location: 'San Francisco, CA',
    email: 'julia@example.com',
  });

  const [onboarding, setOnboardingState] = useState<OnboardingState>({
    identities: [],
    goals: [],
    sizes: {},
    brands: [],
    following: [],
    channels: [],
  });

  const [items, setItems] = useState<ClosetItem[]>(seedItems);
  const [wishlist, setWishlist] = useState<ClosetItem[]>([seedItems[0]]);
  const [sellEnabled, setSellEnabled] = useState(true);
  const [rentEnabled, setRentEnabled] = useState(true);

  const value = useMemo<AppState>(
    () => ({
      profile,
      setProfile: (p) => setProfileState((prev) => ({ ...prev, ...p })),
      onboarding,
      setOnboarding: (o) => setOnboardingState((prev) => ({ ...prev, ...o })),
      items,
      addItem: (item) => setItems((prev) => [item, ...prev]),
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      wishlist,
      toggleWishlist: (item) =>
        setWishlist((prev) =>
          prev.find((i) => i.id === item.id)
            ? prev.filter((i) => i.id !== item.id)
            : [item, ...prev]
        ),
      sellEnabled,
      rentEnabled,
      setSellEnabled,
      setRentEnabled,
    }),
    [profile, onboarding, items, wishlist, sellEnabled, rentEnabled]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
