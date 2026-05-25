import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function initSmoothScroll(): () => void {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return () => {
    if (tickerFn) gsap.ticker.remove(tickerFn);
    tickerFn = null;
    lenis?.destroy();
    lenis = null;
  };
}
