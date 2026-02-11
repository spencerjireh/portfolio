/**
 * LoadingManager - Orchestrates asset loading and controls loader visibility
 */

import type { ThreeManager } from './webgl/three-manager';

export class LoadingManager {
  private loader: HTMLElement | null;
  private body: HTMLElement;
  private timeout = 8000;
  private minDisplayTime = 300;
  private startTime: number;
  private prefersReducedMotion: boolean;

  private loaderText: HTMLElement | null;
  private loaderArc: HTMLElement | null;
  private mobileWarning: HTMLElement | null;
  private mobileWarningBtn: HTMLElement | null;
  private static readonly MOBILE_WARNING_KEY = 'portfolio-mobile-warning-dismissed';
  private static readonly PHONE_THRESHOLD = 480;

  constructor() {
    this.loader = document.querySelector('.site-loader');
    this.loaderText = document.querySelector('.loader-text');
    this.loaderArc = document.querySelector('.loader-arc');
    this.mobileWarning = document.querySelector('.mobile-warning');
    this.mobileWarningBtn = document.querySelector('.mobile-warning-btn');
    this.body = document.body;
    this.startTime = performance.now();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private isPhone(): boolean {
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    return smallerDimension < LoadingManager.PHONE_THRESHOLD;
  }

  private wasWarningDismissed(): boolean {
    try {
      return localStorage.getItem(LoadingManager.MOBILE_WARNING_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private saveWarningDismissal(): void {
    try {
      localStorage.setItem(LoadingManager.MOBILE_WARNING_KEY, 'true');
    } catch {
      // localStorage not available
    }
  }

  private showMobileWarning(onDismiss: () => void): void {
    if (!this.mobileWarning || !this.mobileWarningBtn || !this.loaderText) {
      onDismiss();
      return;
    }

    if (this.loaderArc) {
      this.loaderArc.style.display = 'none';
    }
    this.loaderText.style.display = 'none';
    this.mobileWarning.classList.add('is-visible');
    this.mobileWarning.setAttribute('aria-hidden', 'false');

    const handleDismiss = (): void => {
      this.saveWarningDismissal();
      this.mobileWarningBtn?.removeEventListener('click', handleDismiss);
      onDismiss();
    };

    this.mobileWarningBtn.addEventListener('click', handleDismiss);
  }

  async waitForAssets(threeManager: ThreeManager | null): Promise<void> {
    const promises: Promise<unknown>[] = [
      document.fonts.ready,
      this.waitForFirstFrame(),
    ];

    if (threeManager) {
      promises.push(threeManager.paintingsLoaded);
    }

    await Promise.race([
      Promise.all(promises),
      this.timeoutPromise(),
    ]);

    await this.ensureMinDisplayTime();
  }

  private waitForFirstFrame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  }

  private timeoutPromise(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.timeout));
  }

  private async ensureMinDisplayTime(): Promise<void> {
    const elapsed = performance.now() - this.startTime;
    const remaining = this.minDisplayTime - elapsed;

    if (remaining > 0 && !this.prefersReducedMotion) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
  }

  private doReveal(): void {
    if (this.prefersReducedMotion) {
      this.loader?.classList.add('is-hidden');
      this.body.removeAttribute('data-loading');
      setTimeout(() => this.loader?.remove(), 0);
    } else {
      this.loader?.classList.add('is-hidden');
      this.body.removeAttribute('data-loading');
      setTimeout(() => this.loader?.remove(), 600);
    }
  }

  reveal(): void {
    if (this.isPhone() && !this.wasWarningDismissed()) {
      this.showMobileWarning(() => this.doReveal());
    } else {
      this.doReveal();
    }
  }
}
