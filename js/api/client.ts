import type { PortfolioBundle } from './types';

const API_BASE = import.meta.env.DEV
  ? '/api/v1'
  : 'https://folionaut.spencerjireh.com/api/v1';

const ETAG_KEY = 'portfolio-api-etag';

function getStoredETag(): string | null {
  try {
    return localStorage.getItem(ETAG_KEY);
  } catch {
    return null;
  }
}

function storeETag(etag: string): void {
  try {
    localStorage.setItem(ETAG_KEY, etag);
  } catch {
    // localStorage unavailable
  }
}

export async function fetchBundle(
  useEtag = true,
): Promise<{ bundle: PortfolioBundle | null; notModified: boolean }> {
  const headers: Record<string, string> = {};
  if (useEtag) {
    const etag = getStoredETag();
    if (etag) {
      headers['If-None-Match'] = etag;
    }
  }

  const fetchOpts: RequestInit = { headers };
  if (!useEtag) {
    fetchOpts.cache = 'reload'; // bypass browser HTTP cache on retry
  }
  const res = await fetch(`${API_BASE}/content/bundle`, fetchOpts);

  if (res.status === 304) {
    return { bundle: null, notModified: true };
  }

  if (!res.ok) {
    throw new Error(`API responded ${res.status}`);
  }

  const newEtag = res.headers.get('ETag');
  if (newEtag) {
    storeETag(newEtag);
  }

  const json = await res.json();
  const payload = json.data ?? json;
  return { bundle: normalizeBundleResponse(payload), notModified: false };
}

function normalizeBundleResponse(data: Record<string, unknown[]>): PortfolioBundle {
  const sortByOrder = <T extends { sortOrder: number }>(items: T[]): T[] =>
    [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    hero: sortByOrder(data.hero as PortfolioBundle['hero'] ?? []),
    experience: sortByOrder(data.experience as PortfolioBundle['experience'] ?? []),
    skill: sortByOrder(data.skill as PortfolioBundle['skill'] ?? []),
    project: sortByOrder(data.project as PortfolioBundle['project'] ?? []),
    contact: sortByOrder(data.contact as PortfolioBundle['contact'] ?? []),
  };
}
