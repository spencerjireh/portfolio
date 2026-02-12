/**
 * Main Entry Point
 * Initializes all systems: WebGL watercolor effect, navigation, and animations
 */

import '../css/main.css';

import { ThreeManager } from './webgl/three-manager';
import { SceneController } from './webgl/scene-controller';
import { LoadingManager } from './loading-manager';
import { detectMobile } from './utils';
import { initNavigation } from './ui/navigation';
import { initRevealAnimations } from './ui/reveal-animations';
import { initSmoothScroll } from './ui/smooth-scroll';
import { initExperiencePanel } from './ui/experience-panel';
import { initSkillsInteraction } from './ui/skills-interaction';
import { initPaintingAttribution } from './ui/painting-attribution';
import { initCopyEmail } from './ui/copy-email';
import { initChatWidget } from './ui/chat-widget';
import { loadContent } from './api/content-loader';
import { renderAllContent } from './api/renderers';

declare global {
  interface Window {
    portfolio: Portfolio;
  }
}

class Portfolio {
  threeManager: ThreeManager | null = null;
  sceneController: SceneController | null = null;
  private disposers: (() => void)[] = [];

  constructor() {
    this.init();
  }

  init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup(): Promise<void> {
    const isMobile = detectMobile();
    const loadingManager = new LoadingManager();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      this.initWebGL(isMobile);
    } else {
      const canvas = document.getElementById('webgl-canvas');
      if (canvas) {
        canvas.style.display = 'none';
      }
    }

    // Start content fetch in parallel with asset loading (fire-and-forget)
    loadContent().then(bundle => {
      try {
        if (bundle) renderAllContent(bundle);
      } catch (e) {
        console.warn('Content render failed, using hardcoded HTML:', e);
      }
    });

    await loadingManager.waitForAssets(this.threeManager);
    loadingManager.reveal();

    this.threeManager?.loadRemainingPaintings();

    // Init UI modules -- collect dispose functions
    const navDispose = initNavigation({
      sceneController: this.sceneController,
      isMobile: this.threeManager?.isMobile ?? isMobile,
    });
    const revealDispose = initRevealAnimations();
    initSmoothScroll();
    const expDispose = initExperiencePanel();
    const skillsDispose = initSkillsInteraction();
    initPaintingAttribution({
      sceneController: this.sceneController,
      isMobile,
    });
    initCopyEmail();
    const chatDispose = initChatWidget();

    this.disposers.push(navDispose, revealDispose, expDispose, skillsDispose, chatDispose);

    // Window resize for WebGL
    const onResize = () => this.threeManager?.resize();
    window.addEventListener('resize', onResize);
    this.disposers.push(() => window.removeEventListener('resize', onResize));
  }

  initWebGL(isMobile: boolean): void {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      console.warn('WebGL canvas not found');
      return;
    }

    try {
      this.threeManager = new ThreeManager({
        canvas,
        isMobile,
      });

      if (this.threeManager.webglVersion === 0) {
        console.warn('WebGL not supported, using CSS fallback');
        canvas.style.display = 'none';
        return;
      }

      if (this.threeManager.webglVersion === 2) {
        console.log('Using WebGL 2.0 with Three.js watercolor effect');
      } else if (this.threeManager.webglVersion === 1) {
        console.log('Using WebGL 1.0 with Three.js watercolor effect');
      }
      console.log('Mobile mode:', this.threeManager.isMobile);

      this.sceneController = new SceneController(this.threeManager);
      this.sceneController.start();
    } catch (error) {
      console.error('Failed to initialize WebGL:', error);
      canvas.style.display = 'none';
    }
  }

  dispose(): void {
    this.disposers.forEach(fn => fn());
    this.sceneController?.dispose();
    this.threeManager?.dispose();
  }
}

const portfolio = new Portfolio();
window.portfolio = portfolio;
