import type { SceneController } from '../webgl/scene-controller';
import { PAINTINGS } from '../webgl/three-manager';

interface PaintingAttributionDeps {
  sceneController: SceneController | null;
  isMobile: boolean;
}

export function initPaintingAttribution(deps: PaintingAttributionDeps): void {
  const attribution = document.querySelector<HTMLElement>('[data-painting-attribution]');
  const titleEl = document.querySelector<HTMLElement>('[data-painting-title]');
  const artistEl = document.querySelector<HTMLElement>('[data-painting-artist]');

  if (!attribution || !titleEl || !artistEl) return;

  if (deps.isMobile) return;

  window.addEventListener('paintingchange', ((e: CustomEvent) => {
    const { title, artist, isTransitioning } = e.detail;

    titleEl.textContent = title;
    artistEl.textContent = artist;

    if (isTransitioning) {
      attribution.classList.add('is-transitioning');
    } else {
      attribution.classList.remove('is-transitioning');
      attribution.classList.add('is-visible');
    }
  }) as EventListener);

  if (deps.sceneController) {
    const index = deps.sceneController.currentPaintingIndex;
    const painting = PAINTINGS[index];
    titleEl.textContent = painting.title;
    artistEl.textContent = painting.artist;
    attribution.classList.add('is-visible');
  }
}
