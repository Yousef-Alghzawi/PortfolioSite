import { gsap } from 'gsap';

// Custom data-crosshair cursor. Active only on fine pointers.
export function initCursor(): () => void {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};

  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  const label = ring?.querySelector<HTMLElement>('.cursor-label') ?? null;
  if (!dot || !ring) return () => {};

  document.body.classList.add('has-custom-cursor');
  gsap.set([dot, ring], { opacity: 1 });

  const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
  const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
  const xRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
  const yRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });

  const onMove = (e: MouseEvent) => {
    xDot(e.clientX); yDot(e.clientY);
    xRing(e.clientX); yRing(e.clientY);
  };

  const onOver = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor], a, button');
    if (!target) return;
    ring.classList.add('is-active');
    const text = target.getAttribute('data-cursor');
    if (label) label.textContent = text ?? '';
  };
  const onOut = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor], a, button');
    if (!target) return;
    ring.classList.remove('is-active');
    if (label) label.textContent = '';
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);

  return () => {
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    document.body.classList.remove('has-custom-cursor');
    gsap.set([dot, ring], { opacity: 0 });
    ring.classList.remove('is-active');
  };
}
