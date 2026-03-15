export function initSmoothScroll(): () => void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  const ac = new AbortController();

  links.forEach(link => {
    link.addEventListener('click', (e: MouseEvent) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();

      const target = href ? document.querySelector(href) : null;
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, { signal: ac.signal });
  });

  return () => ac.abort();
}
