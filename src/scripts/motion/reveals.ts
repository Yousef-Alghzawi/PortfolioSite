import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from './splitText';

// Reuses existing `.reveal-on-scroll` markup (CSS handles the transition) and
// adds editorial line reveals on `[data-split-reveal]` headings.
export function initReveals(reduced: boolean): () => void {
  if (reduced) {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
    return () => {};
  }

  const restores: Array<() => void> = [];

  // Class-toggle reveals (the CSS transition animates opacity/translate).
  const batch = ScrollTrigger.batch('.reveal-on-scroll', {
    start: 'top 90%',
    onEnter: (els) => els.forEach((el) => el.classList.add('is-visible')),
  });

  // Editorial line-by-line reveals.
  document.querySelectorAll<HTMLElement>('[data-split-reveal]').forEach((el) => {
    const split = splitLines(el);
    restores.push(split.restore);
    gsap.set(split.lines, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(split.lines, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' }),
    });
  });

  return () => {
    batch.forEach((st) => st.kill());
    restores.forEach((r) => r());
  };
}
