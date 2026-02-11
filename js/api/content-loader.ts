import type { PortfolioBundle } from './types';
import { fetchBundle } from './client';
import { getCachedBundle, setCachedBundle } from './cache';

export async function loadContent(): Promise<PortfolioBundle | null> {
  // 1. Try API fetch with ETag
  try {
    const result = await fetchBundle();
    if (result.bundle) {
      setCachedBundle(result.bundle);
      return result.bundle;
    }
    if (result.notModified) {
      // 304 -- server confirmed data unchanged, use cache ignoring TTL
      const validated = getCachedBundle(true);
      if (validated) {
        setCachedBundle(validated); // refresh TTL
        return validated;
      }
      // Orphaned ETag (cache was cleared) -- retry without ETag to get fresh data
      const retry = await fetchBundle(false);
      if (retry.bundle) {
        setCachedBundle(retry.bundle);
        return retry.bundle;
      }
    }
  } catch (e) {
    console.warn('CMS API fetch failed:', e);
  }

  // 2. Try localStorage cache
  const cached = getCachedBundle();
  if (cached) {
    console.warn('Using cached CMS content');
    return cached;
  }

  // 3. No content available -- hardcoded HTML remains untouched
  console.warn('No CMS content available, using hardcoded HTML');
  return null;
}
