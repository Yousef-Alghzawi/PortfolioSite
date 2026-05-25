import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smoothScroll';
import { initCursor } from './cursor';
import { initNav } from './nav';
import { initFaq } from './faq';
import { initCounters } from './counters';
import { initReveals } from './reveals';
import { initParallax } from './parallax';
import { initMarquee } from './marquee';
import { initScrolly } from './scrolly';

gsap.registerPlugin(ScrollTrigger);

let cleanups: Array<() => void> = [];
let generation = 0;
let ctx: gsap.Context | null = null;

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglCapable(): boolean {
  if (!window.matchMedia('(pointer: fine)').matches) return false;
  if ((navigator.hardwareConcurrency || 0) < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export function initMotion(): void {
  destroyMotion();
  const gen = ++generation;
  const reduced = prefersReduced();

  ctx = gsap.context(() => {
    if (!reduced) cleanups.push(initSmoothScroll());
    cleanups.push(initNav(reduced));
    cleanups.push(initFaq(reduced));
    cleanups.push(initCounters(reduced));
    cleanups.push(initReveals(reduced));
    cleanups.push(initParallax(reduced));
    cleanups.push(initMarquee(reduced));
    cleanups.push(initScrolly(reduced));
    if (!reduced) cleanups.push(initCursor());
  });

  const canDoWebGL = !reduced && webglCapable();

  // Living-data hero (code-split).
  const heroEl = document.querySelector<HTMLElement>('[data-hero-webgl]');
  if (heroEl) {
    const fallback = heroEl.querySelector<HTMLElement>('.hero-fallback');
    if (canDoWebGL) {
      import('./heroWebGL').then(({ initHeroWebGL }) => {
        if (gen !== generation) return;
        const dispose = initHeroWebGL(heroEl);
        if (fallback) fallback.style.opacity = '0';
        cleanups.push(() => {
          dispose();
          if (fallback) fallback.style.opacity = '';
        });
      }).catch(() => {});
    }
  }

  // Fluid-distortion case-study headers (code-split).
  if (canDoWebGL) {
    document.querySelectorAll<HTMLElement>('[data-fluid-header]').forEach((el) => {
      import('./fluidHeader').then(({ initFluidHeader }) => {
        if (gen !== generation) return;
        const dispose = initFluidHeader(el);
        const fb = el.querySelector<HTMLElement>('.fluid-fallback');
        if (fb) fb.style.opacity = '0';
        cleanups.push(() => {
          dispose();
          if (fb) fb.style.opacity = '';
        });
      }).catch(() => {});
    });
  }

  // Settle layout, then sync ScrollTrigger.
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export function destroyMotion(): void {
  generation++;
  cleanups.forEach((c) => { try { c(); } catch { /* noop */ } });
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
  ctx?.revert();
  ctx = null;
}
