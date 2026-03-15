export function initProjectAccordion(): () => void {
  const projectArticles = document.querySelectorAll<HTMLElement>('[data-project-article]');

  if (projectArticles.length === 0) return () => {};

  const ac = new AbortController();

  const toggleAccordion = (article: HTMLElement): void => {
    const isExpanded = article.classList.contains('is-expanded');

    projectArticles.forEach(other => {
      if (other !== article) {
        other.classList.remove('is-expanded');
      }
    });

    if (isExpanded) {
      article.classList.remove('is-expanded');
    } else {
      article.classList.add('is-expanded');

      setTimeout(() => {
        article.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  projectArticles.forEach(article => {
    article.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;

      if (window.innerWidth >= 1024) return;

      toggleAccordion(article);
    }, { signal: ac.signal });
  });

  return () => ac.abort();
}
