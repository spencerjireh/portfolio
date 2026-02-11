import type { PortfolioBundle } from './types';

const CACHE_KEY = 'portfolio-content-bundle';
const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  bundle: PortfolioBundle;
  timestamp: number;
}

export function getCachedBundle(ignoreExpiry = false): PortfolioBundle | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    if (!ignoreExpiry && Date.now() - entry.timestamp > TTL_MS) {
      return null; // Stale, but keep data for 304 revalidation
    }

    return entry.bundle;
  } catch {
    return null;
  }
}

export function setCachedBundle(bundle: PortfolioBundle): void {
  try {
    const entry: CacheEntry = { bundle, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}
