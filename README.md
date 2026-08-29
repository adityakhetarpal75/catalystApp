# Catalyst

Catalyst is a community-driven **thrifting & second-hand fashion marketplace** iOS app. Members build a closet, buy / sell / rent / trade pre-loved pieces, follow fellow thrifters, and join community channels.

This repo contains the mobile app built with **React Native + Expo (TypeScript)** and file-based routing via **expo-router**. It targets iOS (and runs on Android & web from the same codebase).

## Tech stack

- **Expo SDK 57** / React Native 0.86 (new architecture)
- **expo-router** (typed, file-based navigation)
- **TypeScript** (strict)
- **@expo/vector-icons** (Ionicons)
- Custom design system (no external UI kit) — see `constants/theme.ts` and `components/`

## Getting started

```bash
npm install

# iOS (requires macOS + Xcode, or use the Expo Go app on a device)
npm run ios

# Android
npm run android

# Web preview (works anywhere)
npm run web
```

Then scan the QR code with **Expo Go** on your iPhone, or press `i` to open the iOS simulator.

To type-check:

```bash
npm run typecheck
```

## App flows

| Area | Screens |
| --- | --- |
| **Onboarding / Auth** | Splash, Welcome, Email/Facebook/Google login, password, "Welcome back", Forgot password → check email → 4-digit code → new password, Create account (email + name + password), Check email, Account created |
| **Profile onboarding** | Personal info, Community/identity, Age, Style, Thrifting goals, Sizes, Favourite brands, Follow thrifters, Join channels |
| **Home** | Greeting, search, category filters, featured drop, recommended carousel, nearby thrifters, trending grid |
| **Closet** | Profile header + stats, `My Closet` / `My Looks` segments, wishlist, closet by category, items to rent, add item (with success modal), edit closet (remove items) |
| **Discover** | Search, Items / People tabs, filter chips, product grid |
| **Item detail** | Gallery, price, Buy/Rent, Add to wishlist, description, tags, material/condition metadata, seller notes |
| **Profile & settings** | Settings menu, Edit profile (persona, sizes, preferences), Wishlist, Shipping info, My Sales, My Purchases, My Trades |

## Project structure

```
app/                 # expo-router routes
  index.tsx          # animated splash
  (auth)/            # login, signup, password reset
  (onboarding)/      # profile setup questionnaire
  (tabs)/            # Home, Closet, Discover (bottom tab bar)
  closet/            # add-item, edit closet
  item/[id].tsx      # product detail
  profile/           # settings, edit, wishlist, shipping, sales, purchases, trades
components/          # reusable UI (Button, Input, Header, cards, etc.)
constants/           # theme tokens + mock data
context/             # global app state (profile, closet, wishlist, onboarding)
```

## Auth (sign in / sign out)

Session state lives in `context/AuthContext.tsx` (stored via `lib/storage.ts`).

| Action | Behavior |
| --- | --- |
| **Sign in** (email or social) | Creates a session with `onboardingComplete: true`, then lands on Home |
| **Sign up** | Creates a session with `onboardingComplete: false`, then runs the questionnaire |
| **Finish onboarding** | Marks `onboardingComplete: true` and opens Home |
| **Sign out** (Settings → confirm) | Clears the stored session and returns to Welcome |
| **Cold start** | Splash reads the stored session and routes to Home, onboarding, or Welcome |

Tabs are gated: signed-out users are redirected to Welcome; signed-in users who haven’t finished onboarding are sent back to Personal Info.

## Notes

- Profile/closet/wishlist data is still in-memory mock data (`AppContext`). Auth session is the only persisted piece.
- The design language (near-black primary actions on white surfaces, slate accent screens, coral FAB on Discover) follows the Catalyst Figma flows.
