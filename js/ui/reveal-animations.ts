export function initRevealAnimations(): void {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length === 0) return;

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

  requestAnimationFrame(() => {
    revealElements.forEach(el => observer.observe(el));
  });
}
