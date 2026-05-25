import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Kinetic marquee. Base auto-scroll, with scroll velocity nudging speed/direction.
// Markup: .marquee-shell > .marquee-track (content duplicated for seamless loop).
export function initMarquee(reduced: boolean): () => void {
  const shells = document.querySelectorAll<HTMLElement>('[data-marquee]');
  if (!shells.length) return () => {};

  const cleanups: Array<() => void> = [];

  shells.forEach((shell) => {
    const track = shell.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;

    // Duplicate content once for a seamless loop.
    track.innerHTML += track.innerHTML;
    const dir = shell.dataset.marqueeDir === 'right' ? 1 : -1;
    const half = track.scrollWidth / 2;

    if (reduced || half === 0) return;

    const baseSpeed = (parseFloat(shell.dataset.marqueeSpeed || '60')) * dir; // px/s
    let pos = 0;
    let velocityBoost = 0;

    const tickerFn = (_t: number, deltaMs: number) => {
      const dt = (deltaMs || 16) / 1000;
      pos += (baseSpeed + velocityBoost) * dt;
      // wrap
      if (pos <= -half) pos += half;
      if (pos >= 0) pos -= half;
      gsap.set(track, { x: pos });
      velocityBoost *= 0.92;
    };
    gsap.ticker.add(tickerFn);

    const st = ScrollTrigger.create({
      trigger: shell,
      onUpdate: (self) => {
        velocityBoost = self.getVelocity() * 0.15 * dir;
      },
    });

    cleanups.push(() => {
      gsap.ticker.remove(tickerFn);
      st.kill();
    });
  });

  return () => cleanups.forEach((c) => c());
}
