// Number counting animation for [data-target] (ported from script.js).
export function initCounters(reduced: boolean): () => void {
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-target]'));
  if (!counters.length) return () => {};

  const render = (el: HTMLElement, value: number) => {
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    el.textContent = prefix + value.toFixed(decimals) + suffix;
  };

  if (reduced) {
    counters.forEach((el) => render(el, parseFloat(el.getAttribute('data-target') || '0')));
    return () => {};
  }

  const frames = new Set<number>();
  const animate = (el: HTMLElement) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      render(el, ease * target);
      if (p < 1) frames.add(requestAnimationFrame(step));
    };
    frames.add(requestAnimationFrame(step));
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));

  return () => {
    observer.disconnect();
    frames.forEach((f) => cancelAnimationFrame(f));
  };
}
