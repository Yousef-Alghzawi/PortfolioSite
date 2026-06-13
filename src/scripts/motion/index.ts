import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smoothScroll';
import { initNav } from './nav';
import { initFaq } from './faq';
import { initCounters } from './counters';
import { initReveals } from './reveals';
import { initParallax } from './parallax';
import { initMarquee } from './marquee';
import { initScrollPath } from './scrollPath';
import { initHGallery } from './hGallery';

gsap.registerPlugin(ScrollTrigger);

let cleanups: Array<() => void> = [];
let generation = 0;
let ctx: gsap.Context | null = null;

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    cleanups.push(initScrollPath());
    cleanups.push(initHGallery(reduced));
  });

  // Living symbol field (code-split; skipped under reduced motion — the
  // static CSS fallback texture shows instead).
  const fieldHost = document.querySelector<HTMLElement>('[data-symbol-field]');
  if (fieldHost && !reduced) {
    import('./symbolField').then(({ initSymbolField }) => {
      if (gen !== generation) return;
      cleanups.push(initSymbolField(fieldHost));
    }).catch(() => {});
  }

  // Header shadow on scroll.
  const header = document.querySelector<HTMLElement>('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));
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
