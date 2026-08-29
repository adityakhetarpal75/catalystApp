/**
 * Local account registry (device storage).
 * Passwords are hashed with a simple salted digest — enough for a local prototype
 * (not a substitute for a real backend auth service).
 */

import { storage } from './storage';

const USERS_KEY = 'catalyst.auth.users';

export type StoredAccount = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  onboardingComplete: boolean;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim().replace(/^@/, '').toLowerCase();
}

/** Lightweight deterministic hash (not crypto-grade; local prototype only). */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const input = `${salt}::${password}::catalyst`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Mix again with reversed string for a bit more avalanche
  for (let i = input.length - 1; i >= 0; i--) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 2246822519);
  }
  return `h${(h >>> 0).toString(16)}_${salt}`;
}

export async function loadAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await storage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

async function saveAccounts(accounts: StoredAccount[]) {
  await storage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export async function findAccountByEmailOrUsername(login: string): Promise<StoredAccount | null> {
  const key = login.trim().toLowerCase().replace(/^@/, '');
  const accounts = await loadAccounts();
  return (
    accounts.find((a) => a.email === key || a.username.toLowerCase() === key) ?? null
  );
}

export async function emailTaken(email: string): Promise<boolean> {
  const accounts = await loadAccounts();
  const e = normalizeEmail(email);
  return accounts.some((a) => a.email === e);
}

export async function usernameTaken(username: string): Promise<boolean> {
  const accounts = await loadAccounts();
  const u = normalizeUsername(username);
  return accounts.some((a) => a.username.toLowerCase() === u);
}

export async function createAccount(input: {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<StoredAccount> {
  const email = normalizeEmail(input.email);
  const username = normalizeUsername(input.username);
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!email.includes('@')) throw new Error('Please enter a valid email address');
  if (username.length < 3) throw new Error('Username must be at least 3 characters');
  if (!/^[a-z0-9._]+$/i.test(username)) {
    throw new Error('Username can only use letters, numbers, dots, and underscores');
  }
  if (!firstName || !lastName) throw new Error('First and last name are required');
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters');

  if (await emailTaken(email)) throw new Error('An account with this email already exists');
  if (await usernameTaken(username)) throw new Error('That username is already taken');

  const id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(input.password, id);
  const account: StoredAccount = {
    id,
    email,
    username,
    firstName,
    lastName,
    passwordHash,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  };

  const accounts = await loadAccounts();
  accounts.push(account);
  await saveAccounts(accounts);
  return account;
}

export async function verifyLogin(login: string, password: string): Promise<StoredAccount> {
  const account = await findAccountByEmailOrUsername(login);
  if (!account) throw new Error('No account found. Please create an account first.');
  const hash = await hashPassword(password, account.id);
  if (hash !== account.passwordHash) throw new Error('Incorrect password');
  return account;
}

export async function updateAccountPassword(email: string, newPassword: string): Promise<StoredAccount> {
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');
  const accounts = await loadAccounts();
  const idx = accounts.findIndex((a) => a.email === normalizeEmail(email));
  if (idx < 0) throw new Error('No account found for that email');
  const account = accounts[idx];
  const passwordHash = await hashPassword(newPassword, account.id);
  const next = { ...account, passwordHash };
  accounts[idx] = next;
  await saveAccounts(accounts);
  return next;
}

export async function markAccountOnboarded(userId: string): Promise<StoredAccount | null> {
  const accounts = await loadAccounts();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx < 0) return null;
  const next = { ...accounts[idx], onboardingComplete: true };
  accounts[idx] = next;
  await saveAccounts(accounts);
  return next;
}

export async function updateAccountProfile(
  userId: string,
  patch: Partial<Pick<StoredAccount, 'firstName' | 'lastName' | 'username' | 'email'>>
): Promise<StoredAccount | null> {
  const accounts = await loadAccounts();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx < 0) return null;
  const next = { ...accounts[idx], ...patch };
  if (patch.username) next.username = normalizeUsername(patch.username);
  if (patch.email) next.email = normalizeEmail(patch.email);
  accounts[idx] = next;
  await saveAccounts(accounts);
  return next;
}
