import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { storage } from '../lib/storage';

const AUTH_KEY = 'catalyst.auth.session';

export type AuthUser = {
  email: string;
  firstName: string;
  lastName: string;
  /** True after completing the onboarding questionnaire */
  onboardingComplete: boolean;
};

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type PendingCredentials = {
  email: string;
  firstName: string;
  lastName: string;
};

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pending: PendingCredentials;
  setPending: (p: Partial<PendingCredentials>) => void;
  /** Sign in an existing user (login / password reset). Marks onboarding complete. */
  signIn: (overrides?: Partial<PendingCredentials>) => Promise<void>;
  /** Create a new account. Leaves onboarding incomplete so the questionnaire runs. */
  signUp: (overrides?: Partial<PendingCredentials>) => Promise<void>;
  /** Persist that the user finished onboarding. */
  completeOnboarding: () => Promise<void>;
  /** Clear the session and return to signed-out state. */
  signOut: () => Promise<void>;
}

const emptyPending: PendingCredentials = { email: '', firstName: '', lastName: '' };

const AuthContext = createContext<AuthContextValue | null>(null);

async function persist(user: AuthUser | null) {
  if (user) {
    await storage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    await storage.removeItem(AUTH_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pending, setPendingState] = useState<PendingCredentials>(emptyPending);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await storage.getItem(AUTH_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as AuthUser;
          setUser(parsed);
          setStatus('signedIn');
        } else {
          setStatus('signedOut');
        }
      } catch {
        if (!cancelled) setStatus('signedOut');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPending = useCallback((p: Partial<PendingCredentials>) => {
    setPendingState((prev) => ({ ...prev, ...p }));
  }, []);

  const buildUser = useCallback(
    (overrides: Partial<PendingCredentials> | undefined, onboardingComplete: boolean): AuthUser => {
      const email = (overrides?.email ?? pending.email).trim().toLowerCase();
      const firstName = (overrides?.firstName ?? pending.firstName).trim() || 'Julia';
      const lastName = (overrides?.lastName ?? pending.lastName).trim() || 'Jess';
      return {
        email: email || 'julia@example.com',
        firstName,
        lastName,
        onboardingComplete,
      };
    },
    [pending]
  );

  const signIn = useCallback(
    async (overrides?: Partial<PendingCredentials>) => {
      const next = buildUser(overrides, true);
      await persist(next);
      setUser(next);
      setStatus('signedIn');
      setPendingState(emptyPending);
    },
    [buildUser]
  );

  const signUp = useCallback(
    async (overrides?: Partial<PendingCredentials>) => {
      const next = buildUser(overrides, false);
      await persist(next);
      setUser(next);
      setStatus('signedIn');
      setPendingState(emptyPending);
    },
    [buildUser]
  );

  const completeOnboarding = useCallback(async () => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, onboardingComplete: true };
      void persist(next);
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    await persist(null);
    setUser(null);
    setPendingState(emptyPending);
    setStatus('signedOut');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'signedIn' && !!user,
      isLoading: status === 'loading',
      pending,
      setPending,
      signIn,
      signUp,
      completeOnboarding,
      signOut,
    }),
    [status, user, pending, setPending, signIn, signUp, completeOnboarding, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
