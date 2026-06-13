import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pinned horizontal gallery: on desktop, vertical scroll drives the track
// sideways while the section pins below the header. On mobile / reduced
// motion it falls back to a native horizontal swipe (CSS).
export function initHGallery(reduced: boolean): () => void {
  if (reduced) return () => {};
  if (!window.matchMedia('(min-width: 1024px)').matches) return () => {};

  const host = document.querySelector<HTMLElement>('[data-h-gallery]');
  if (!host) return () => {};
  const track = host.querySelector<HTMLElement>('.h-track');
  const viewport = host.querySelector<HTMLElement>('.h-viewport');
  if (!track || !viewport) return () => {};

  host.classList.add('is-pinned');

  const amount = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const tween = gsap.to(track, {
    x: () => -amount(),
    ease: 'none',
    scrollTrigger: {
      trigger: host,
      start: 'top 88px',
      end: () => `+=${amount()}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    host.classList.remove('is-pinned');
    gsap.set(track, { clearProps: 'transform' });
  };
}
