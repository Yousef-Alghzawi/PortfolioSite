import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Horizontal pinned-scroll gallery on desktop. On touch/mobile the CSS
// (overflow-x: auto + scroll-snap) handles a simple swipe instead.
export function initHGallery(reduced: boolean): () => void {
  if (reduced) return () => {};
  if (window.innerWidth < 1024) return () => {};

  const galleries = Array.from(document.querySelectorAll<HTMLElement>('[data-h-gallery]'));
  if (!galleries.length) return () => {};

  const triggers: ScrollTrigger[] = [];

  galleries.forEach((gallery) => {
    const track = gallery.querySelector<HTMLElement>('.h-track');
    if (!track) return;

    const distance = () => Math.max(0, track.scrollWidth - gallery.offsetWidth);
    if (distance() <= 0) return;

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: gallery,
        start: 'center center',
        end: () => '+=' + distance(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

    // Subtle parallax on each card image as it crosses the viewport.
    gallery.querySelectorAll<HTMLElement>('[data-h-parallax]').forEach((img) => {
      gsap.fromTo(img, { xPercent: -6 }, {
        xPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'center center',
          end: () => '+=' + distance(),
          scrub: true,
        },
      });
    });
  });

  return () => triggers.forEach((t) => t.kill());
}
