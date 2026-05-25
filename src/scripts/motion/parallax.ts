import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Vertical parallax on [data-parallax] (value = strength in px, default 60).
export function initParallax(reduced: boolean): () => void {
  if (reduced) return () => {};

  const triggers: ScrollTrigger[] = [];
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const strength = parseFloat(el.dataset.parallax || '60');
    const tween = gsap.fromTo(
      el,
      { yPercent: -strength / 10 },
      {
        yPercent: strength / 10,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  return () => triggers.forEach((t) => t.kill());
}
