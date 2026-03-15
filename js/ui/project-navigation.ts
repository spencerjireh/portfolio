export function initProjectNavigation(): () => void {
  const sideNav = document.querySelector<HTMLElement>('[data-project-nav]');
  const dotsNav = document.querySelector<HTMLElement>('[data-project-dots]');
  const projectSections = document.querySelectorAll<HTMLElement>('[data-project-section]');
  const sideNavItems = sideNav?.querySelectorAll<HTMLAnchorElement>('[data-nav-target]');
  const dotButtons = dotsNav?.querySelectorAll<HTMLButtonElement>('[data-dot-target]');

  if (!sideNav || !dotsNav || projectSections.length === 0) return () => {};

  const ac = new AbortController();

  const setActiveProject = (projectNum: string | null): void => {
    sideNavItems?.forEach((item) => {
      const target = item.getAttribute('data-nav-target');
      if (target === projectNum) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    dotButtons?.forEach((dot) => {
      const target = dot.getAttribute('data-dot-target');
      if (target === projectNum) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });
  };

  const setNavVisibility = (visible: boolean): void => {
    if (visible) {
      sideNav.classList.add('is-visible');
      dotsNav.classList.add('is-visible');
    } else {
      sideNav.classList.remove('is-visible');
      dotsNav.classList.remove('is-visible');
    }
  };

  // Single observer for all tracked sections to avoid race conditions between
  // competing observers that cause nav flicker at section boundaries.
  const allSections = new Map<Element, string | null>();

  for (const section of projectSections) {
    allSections.set(section, section.getAttribute('data-project-section'));
  }

  const nonProjectSections = [
    document.getElementById('hero'),
    document.getElementById('experience'),
    document.getElementById('skills'),
    document.getElementById('projects-index'),
    document.getElementById('contact'),
  ].filter(Boolean) as HTMLElement[];

  for (const section of nonProjectSections) {
    allSections.set(section, null);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const projectNum = allSections.get(entry.target);
        if (projectNum) {
          setActiveProject(projectNum);
          setNavVisibility(true);
        } else {
          setNavVisibility(false);
          setActiveProject(null);
        }
      }
    },
    {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    },
  );

  for (const section of allSections.keys()) sectionObserver.observe(section);

  sideNavItems?.forEach((item) => {
    item.addEventListener(
      'click',
      (e: MouseEvent) => {
        e.preventDefault();
        const target = item.getAttribute('data-nav-target');
        const section = document.querySelector(`[data-project-section="${target}"]`);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      { signal: ac.signal },
    );
  });

  dotButtons?.forEach((dot) => {
    dot.addEventListener(
      'click',
      () => {
        const target = dot.getAttribute('data-dot-target');
        const section = document.querySelector(`[data-project-section="${target}"]`);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });

          if (window.innerWidth < 1024) {
            setTimeout(() => {
              const projectArticle = section.querySelector<HTMLElement>('[data-project-article]');
              if (projectArticle && !projectArticle.classList.contains('is-expanded')) {
                projectArticle.click();
              }
            }, 400);
          }
        }
      },
      { signal: ac.signal },
    );
  });

  return () => {
    ac.abort();
    sectionObserver.disconnect();
  };
}
