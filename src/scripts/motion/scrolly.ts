import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Drives scrollytelling charts: SVG path drawing, CI bands, forest-plot rows.
// Containers: [data-scrolly]. Children: .draw-path (SVG path), .ci-band, .forest-row.
export function initScrolly(reduced: boolean): () => void {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-scrolly]'));
  if (!containers.length) return () => {};

  const triggers: ScrollTrigger[] = [];

  containers.forEach((container) => {
    const paths = Array.from(container.querySelectorAll<SVGPathElement>('.draw-path'));
    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.setProperty('--path-len', String(len));
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
    });
    const bands = container.querySelectorAll<SVGElement>('.ci-band');
    const rows = container.querySelectorAll<HTMLElement>('.forest-row');

    if (reduced) {
      bands.forEach((b) => b.classList.add('is-shown'));
      rows.forEach((r) => r.classList.add('is-shown'));
      return;
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (paths.length) {
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.3 });
        }
        if (bands.length) {
          gsap.to(bands, { opacity: 1, duration: 0.8, delay: 0.4, onStart: () => bands.forEach((b) => b.classList.add('is-shown')) });
        }
        if (rows.length) {
          rows.forEach((r, i) => {
            gsap.to(r, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.12, ease: 'power3.out', onStart: () => r.classList.add('is-shown') });
          });
        }
      },
    });
    triggers.push(st);
  });

  return () => triggers.forEach((t) => t.kill());
}
