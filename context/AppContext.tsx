import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  circles as seedCircles,
  ClosetItem,
  closetItems as seedItems,
  Look,
  looks as seedLooks,
  Post,
  posts as seedPosts,
} from '../constants/data';
import { useAuth } from './AuthContext';

export type ComposeProduct = { id: string; brand: string; name: string };

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
  looks: Look[];
  addLook: (look: Look) => void;
  removeLook: (id: string) => void;
  sellEnabled: boolean;
  rentEnabled: boolean;
  setSellEnabled: (v: boolean) => void;
  setRentEnabled: (v: boolean) => void;
  joinedCircles: string[];
  toggleCircle: (id: string) => void;
  channelsIntroSeen: boolean;
  markChannelsIntroSeen: () => void;
  closetIntroSeen: boolean;
  markClosetIntroSeen: () => void;
  feedPosts: Post[];
  addFeedPost: (post: Post) => void;
  addReply: (postId: string, reply: Post['replies'][number]) => void;
  composeProducts: ComposeProduct[];
  setComposeProducts: (products: ComposeProduct[]) => void;
  removeComposeProduct: (id: string) => void;
  clearComposeProducts: () => void;
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
  const [looksState, setLooksState] = useState<Look[]>(seedLooks);
  const [sellEnabled, setSellEnabled] = useState(true);
  const [rentEnabled, setRentEnabled] = useState(true);
  const [joinedCircles, setJoinedCircles] = useState<string[]>(
    seedCircles.filter((c) => c.joined).map((c) => c.id)
  );
  const [channelsIntroSeen, setChannelsIntroSeen] = useState(false);
  const [closetIntroSeen, setClosetIntroSeen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(seedPosts);
  const [composeProducts, setComposeProducts] = useState<ComposeProduct[]>([]);

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
      looks: looksState,
      addLook: (look) => setLooksState((prev) => [look, ...prev]),
      removeLook: (id) => setLooksState((prev) => prev.filter((l) => l.id !== id)),
      sellEnabled,
      rentEnabled,
      setSellEnabled,
      setRentEnabled,
      joinedCircles,
      toggleCircle: (id) =>
        setJoinedCircles((prev) =>
          prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        ),
      channelsIntroSeen,
      markChannelsIntroSeen: () => setChannelsIntroSeen(true),
      closetIntroSeen,
      markClosetIntroSeen: () => setClosetIntroSeen(true),
      feedPosts,
      addFeedPost: (post) => setFeedPosts((prev) => [post, ...prev]),
      addReply: (postId, reply) =>
        setFeedPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
        ),
      composeProducts,
      setComposeProducts,
      removeComposeProduct: (id) =>
        setComposeProducts((prev) => prev.filter((p) => p.id !== id)),
      clearComposeProducts: () => setComposeProducts([]),
    }),
    [
      profile,
      onboarding,
      items,
      wishlist,
      looksState,
      sellEnabled,
      rentEnabled,
      joinedCircles,
      channelsIntroSeen,
      closetIntroSeen,
      feedPosts,
      composeProducts,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
