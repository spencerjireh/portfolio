export function initSkillsInteraction(): () => void {
  const skillItems = document.querySelectorAll<HTMLButtonElement>('[data-skill]');

  if (skillItems.length === 0) return () => {};

  const toggleExpansion = (item: HTMLButtonElement): void => {
    const isExpanded = item.classList.contains('is-expanded');

    skillItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('is-expanded');
      }
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

  skillItems.forEach(item => {
    item.addEventListener('click', () => {
      toggleExpansion(item);
    });

    item.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpansion(item);
      }
    });
  });

  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      skillItems.forEach(item => item.classList.remove('is-expanded'));
    }
  };
  document.addEventListener('keydown', escapeHandler);

  return () => {
    document.removeEventListener('keydown', escapeHandler);
  };
}
