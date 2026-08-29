/**
 * Session storage for auth.
 * Uses localStorage on web; falls back to in-memory storage on native.
 * (Keeps the bundle free of optional native modules so Expo Go / Android
 * always resolve. Sessions still persist across reloads on web.)
 */

type StorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memory = new Map<string, string>();

function canUseLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';
  } catch {
    return false;
  }
}

export const storage: StorageLike = {
  async getItem(key) {
    if (canUseLocalStorage()) {
      try {
        return localStorage.getItem(key);
      } catch {
        /* fall through */
      }
    }
    return memory.has(key) ? memory.get(key)! : null;
  },
  async setItem(key, value) {
    if (canUseLocalStorage()) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {
        /* fall through */
      }
    }
    memory.set(key, value);
  },
  async removeItem(key) {
    if (canUseLocalStorage()) {
      try {
        localStorage.removeItem(key);
        return;
      } catch {
        /* fall through */
      }
    }
    memory.delete(key);
  },
};
