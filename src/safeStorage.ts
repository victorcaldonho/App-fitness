/**
 * Safe LocalStorage Wrapper with in-memory fallback.
 * Prevents DOMException crashes in sandboxed iframe environments.
 */
class SafeStorage {
  private memoryStore: Record<string, string> = {};

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Could not read key "${key}" from localStorage. Reading from memory store index:`, e);
      return this.memoryStore[key] || null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[SafeStorage] Could not write key "${key}" to localStorage. Storing in memory fallback:`, e);
      this.memoryStore[key] = value;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Could not remove key "${key}" from localStorage.`, e);
      delete this.memoryStore[key];
    }
  }
}

export const safeStorage = new SafeStorage();
