// Dynamic scroll path: a top progress bar (all viewports) + a right-edge
// section rail (desktop) whose fill tracks scroll and whose dots light up
// for the active section. Anchor clicks are handled by nav.ts smooth-scroll.
export function initScrollPath(): () => void {
  const cleanups: Array<() => void> = [];

  const topFill = document.getElementById('scroll-progress-fill');
  const railFill = document.getElementById('rail-fill');
  const dots = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-dot]'));

  if (!topFill && !railFill && !dots.length) return () => {};

  const update = () => {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (topFill) topFill.style.transform = `scaleX(${p})`;
    if (railFill) railFill.style.transform = `scaleY(${p})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
  cleanups.push(() => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  });

  if (dots.length && 'IntersectionObserver' in window) {
    const sections = dots
      .map((d) => document.getElementById(d.dataset.railDot || ''))
      .filter((s): s is HTMLElement => !!s);

    if (sections.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = (entry.target as HTMLElement).id;
            dots.forEach((d) => d.classList.toggle('active', d.dataset.railDot === id));
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach((s) => io.observe(s));
      cleanups.push(() => io.disconnect());
    }
  }

  return () => cleanups.forEach((c) => c());
}
