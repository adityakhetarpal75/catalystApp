import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { circles as seedCircles, ClosetItem, closetItems as seedItems } from '../constants/data';
import { useAuth } from './AuthContext';

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
  joinedCircles: string[];
  toggleCircle: (id: string) => void;
  channelsIntroSeen: boolean;
  markChannelsIntroSeen: () => void;
}

const emptyProfile: Profile = {
  firstName: '',
  lastName: '',
  username: '',
  bio: '',
  location: '',
  email: '',
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<Profile>(emptyProfile);

  // Keep profile in sync with the real signed-in account
  useEffect(() => {
    if (!user) {
      setProfileState(emptyProfile);
      return;
    }
    setProfileState((prev) => ({
      ...prev,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      // Keep bio/location if already set during onboarding; seed defaults only when empty
      bio: prev.bio || '',
      location: prev.location || '',
    }));
  }, [user?.id, user?.firstName, user?.lastName, user?.username, user?.email]);

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
  const [joinedCircles, setJoinedCircles] = useState<string[]>(
    seedCircles.filter((c) => c.joined).map((c) => c.id)
  );
  const [channelsIntroSeen, setChannelsIntroSeen] = useState(false);

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
      joinedCircles,
      toggleCircle: (id) =>
        setJoinedCircles((prev) =>
          prev.includes(id) ? prev.filter((c) => c !== id) : [id, ...prev]
        ),
      channelsIntroSeen,
      markChannelsIntroSeen: () => setChannelsIntroSeen(true),
    }),
    [profile, onboarding, items, wishlist, sellEnabled, rentEnabled, joinedCircles, channelsIntroSeen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
