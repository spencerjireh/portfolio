export function initSkillsInteraction(): () => void {
  const container = document.querySelector<HTMLElement>('.skills-tiered');

  if (!container) return () => {};

  const collapseAll = (): void => {
    container.querySelectorAll<HTMLButtonElement>('[data-skill].is-expanded')
      .forEach(item => item.classList.remove('is-expanded'));
  };

  const toggleExpansion = (item: HTMLButtonElement): void => {
    const isExpanded = item.classList.contains('is-expanded');

    container.querySelectorAll<HTMLButtonElement>('[data-skill]').forEach(other => {
      if (other !== item) other.classList.remove('is-expanded');
    });

    if (isExpanded) {
      item.classList.remove('is-expanded');
    } else {
      item.classList.add('is-expanded');
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const onClick = (e: MouseEvent): void => {
    const item = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-skill]');
    if (item) toggleExpansion(item);
  };

  const onKeydown = (e: KeyboardEvent): void => {
    const item = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-skill]');
    if (item && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleExpansion(item);
    }
  };

  container.addEventListener('click', onClick);
  container.addEventListener('keydown', onKeydown);

  const escapeHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') collapseAll();
  };
  document.addEventListener('keydown', escapeHandler);

  return () => {
    container.removeEventListener('click', onClick);
    container.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keydown', escapeHandler);
  };
}
