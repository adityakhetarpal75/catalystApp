import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createAccount,
  markAccountOnboarded,
  updateAccountPassword,
  updateAccountProfile,
  verifyLogin,
  type StoredAccount,
} from '../lib/accounts';
import { storage } from '../lib/storage';

const SESSION_KEY = 'catalyst.auth.session';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  onboardingComplete: boolean;
};

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type PendingSignup = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

type PendingLogin = {
  login: string; // email or username
};

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingSignup: PendingSignup;
  pendingLogin: PendingLogin;
  setPendingSignup: (p: Partial<PendingSignup>) => void;
  setPendingLogin: (p: Partial<PendingLogin>) => void;
  /** Validate email/username + password against the local account store. */
  signIn: (login: string, password: string) => Promise<AuthUser>;
  /** Create a real account with username + password, then sign in. */
  signUp: (password: string) => Promise<AuthUser>;
  /** Reset password for an existing account, then sign in. */
  resetPassword: (email: string, newPassword: string) => Promise<AuthUser>;
  completeOnboarding: () => Promise<void>;
  updateUser: (patch: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'username' | 'email'>>) => Promise<void>;
  signOut: () => Promise<void>;
}

const emptySignup: PendingSignup = { email: '', username: '', firstName: '', lastName: '' };
const emptyLogin: PendingLogin = { login: '' };

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    username: account.username,
    firstName: account.firstName,
    lastName: account.lastName,
    onboardingComplete: account.onboardingComplete,
  };
}

async function persistSession(user: AuthUser | null) {
  if (user) await storage.setItem(SESSION_KEY, JSON.stringify(user));
  else await storage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingSignup, setPendingSignupState] = useState<PendingSignup>(emptySignup);
  const [pendingLogin, setPendingLoginState] = useState<PendingLogin>(emptyLogin);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await storage.getItem(SESSION_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as AuthUser;
          // Require a real account id — drop legacy Julia/demo sessions
          if (parsed?.id && parsed?.email && parsed?.username) {
            setUser(parsed);
            setStatus('signedIn');
            return;
          }
        }
        setStatus('signedOut');
      } catch {
        if (!cancelled) setStatus('signedOut');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPendingSignup = useCallback((p: Partial<PendingSignup>) => {
    setPendingSignupState((prev) => ({ ...prev, ...p }));
  }, []);

  const setPendingLogin = useCallback((p: Partial<PendingLogin>) => {
    setPendingLoginState((prev) => ({ ...prev, ...p }));
  }, []);

  const signIn = useCallback(async (login: string, password: string) => {
    const account = await verifyLogin(login, password);
    const next = toAuthUser(account);
    await persistSession(next);
    setUser(next);
    setStatus('signedIn');
    setPendingLoginState(emptyLogin);
    setPendingSignupState(emptySignup);
    return next;
  }, []);

  const signUp = useCallback(
    async (password: string) => {
      const account = await createAccount({
        email: pendingSignup.email,
        username: pendingSignup.username,
        firstName: pendingSignup.firstName,
        lastName: pendingSignup.lastName,
        password,
      });
      const next = toAuthUser(account);
      await persistSession(next);
      setUser(next);
      setStatus('signedIn');
      setPendingSignupState(emptySignup);
      return next;
    },
    [pendingSignup]
  );

  const resetPassword = useCallback(async (email: string, newPassword: string) => {
    const account = await updateAccountPassword(email, newPassword);
    const next = toAuthUser(account);
    await persistSession(next);
    setUser(next);
    setStatus('signedIn');
    setPendingLoginState(emptyLogin);
    return next;
  }, []);

  const completeOnboarding = useCallback(async () => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, onboardingComplete: true };
      void markAccountOnboarded(prev.id);
      void persistSession(next);
      return next;
    });
  }, []);

  const updateUser = useCallback(
    async (patch: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'username' | 'email'>>) => {
      if (!user) return;
      const updated = await updateAccountProfile(user.id, patch);
      if (!updated) return;
      const next = toAuthUser(updated);
      await persistSession(next);
      setUser(next);
    },
    [user]
  );

  const signOut = useCallback(async () => {
    await persistSession(null);
    setUser(null);
    setPendingSignupState(emptySignup);
    setPendingLoginState(emptyLogin);
    setStatus('signedOut');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'signedIn' && !!user,
      isLoading: status === 'loading',
      pendingSignup,
      pendingLogin,
      setPendingSignup,
      setPendingLogin,
      signIn,
      signUp,
      resetPassword,
      completeOnboarding,
      updateUser,
      signOut,
    }),
    [
      status,
      user,
      pendingSignup,
      pendingLogin,
      setPendingSignup,
      setPendingLogin,
      signIn,
      signUp,
      resetPassword,
      completeOnboarding,
      updateUser,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
