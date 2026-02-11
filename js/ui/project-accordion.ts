export function initProjectAccordion(): void {
  const projectArticles = document.querySelectorAll<HTMLElement>('[data-project-article]');

  if (projectArticles.length === 0) return;

  const getFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0].trim() : text.slice(0, 100) + '...';
  };

  projectArticles.forEach(article => {
    const description = article.querySelector('.project-description');
    if (!description) return;

    const fullText = description.textContent || '';
    const teaserText = getFirstSentence(fullText);

    const teaser = document.createElement('p');
    teaser.className = 'project-teaser';
    teaser.textContent = teaserText;

    const header = article.querySelector('.project-article-header');
    if (header) {
      header.insertAdjacentElement('afterend', teaser);
    }
  });

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
    });
  });
}
