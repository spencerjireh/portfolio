export function detectMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
}

export function escUrl(url: string): string {
  try {
    const u = new URL(url, location.origin);
    if (u.protocol === 'https:' || u.protocol === 'http:' || u.protocol === 'mailto:') return url;
  } catch {
    /* invalid URL */
  }
  return '#';
}
