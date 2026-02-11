import type { SceneController } from '../webgl/scene-controller';

interface NavigationDeps {
  sceneController: SceneController | null;
  isMobile: boolean;
}

export function initNavigation(deps: NavigationDeps): () => void {
  const menuTrigger = document.querySelector<HTMLButtonElement>('[data-menu-trigger]');
  const dropdownMenu = document.querySelector<HTMLElement>('[data-dropdown-menu]');
  const dropdownLinks = dropdownMenu?.querySelectorAll<HTMLAnchorElement>('.dropdown-link');
  const changePaintingBtn = document.querySelector<HTMLButtonElement>('[data-change-painting]');

  if (!menuTrigger || !dropdownMenu) return () => {};

  const openMenu = () => {
    dropdownMenu.classList.add('active');
    dropdownMenu.setAttribute('aria-hidden', 'false');
    menuTrigger.classList.add('active');
  };

  const closeMenu = () => {
    dropdownMenu.classList.remove('active');
    dropdownMenu.setAttribute('aria-hidden', 'true');
    menuTrigger.classList.remove('active');
  };

  menuTrigger.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    const isActive = dropdownMenu.classList.contains('active');
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  dropdownLinks?.forEach(link => {
    if (link.hasAttribute('data-change-painting')) return;
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  changePaintingBtn?.addEventListener('click', () => {
    if (!deps.sceneController || deps.isMobile) return;
    if (deps.sceneController.isWashTransitioning) return;
    deps.sceneController.triggerNextPainting();
  });

  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
      closeMenu();
    }
  };
  document.addEventListener('keydown', escapeHandler);

  const clickOutsideHandler = (e: Event) => {
    if (!dropdownMenu.classList.contains('active')) return;

    const target = e.target as HTMLElement;
    const isInsideMenu = dropdownMenu.contains(target);
    const isTrigger = menuTrigger.contains(target);

    if (!isInsideMenu && !isTrigger) {
      closeMenu();
    }
  };
  document.addEventListener('click', clickOutsideHandler);

  return () => {
    document.removeEventListener('keydown', escapeHandler);
    document.removeEventListener('click', clickOutsideHandler);
  };
}
