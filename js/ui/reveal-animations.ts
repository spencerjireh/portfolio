export function initRevealAnimations(): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
  });

  function observeAll(root: ParentNode): void {
    root.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
      observer.observe(el);
    });
  }

  // Observe existing elements
  requestAnimationFrame(() => observeAll(document));

  // Observe dynamically added .reveal elements (e.g. CMS content)
  const mutation = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement) {
          if (node.classList.contains('reveal') && !node.classList.contains('is-visible')) {
            observer.observe(node);
          }
          observeAll(node);
        }
      }
    }
  });

  mutation.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    mutation.disconnect();
  };
}
