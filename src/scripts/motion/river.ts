// Symbol river: a left-gutter canvas where data-science glyphs flow downward
// along a meandering "riverbed" that branches toward each section node. The
// active branch (driven by scrollPath's .active class on the dots) brightens.
// Theme-aware (reads --ink); pauses when the tab is hidden.

const POOL = 'βλΣ∫∇μσθπχραγδ0123456789≈≠≤≥±×÷∂√∞%pΩ'.split('');
const pick = () => POOL[(Math.random() * POOL.length) | 0];

function readInk(): [number, number, number] {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
    const m = v.match(/^#?([0-9a-fA-F]{6})$/);
    if (m) { const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  } catch { /* noop */ }
  return [26, 24, 19];
}

const W = 100;
const SECTIONS = 7;

export function initRiver(reduced: boolean): () => void {
  const host = document.querySelector<HTMLElement>('.river');
  const canvas = host?.querySelector<HTMLCanvasElement>('canvas') ?? null;
  if (!host || !canvas) return () => {};
  if (!window.matchMedia('(min-width: 1400px)').matches) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let H = window.innerHeight;
  let ink = readInk();

  interface Drop { y: number; sp: number; ch: string; a: number; }
  let drops: Drop[] = [];

  const riverX = (y: number) => 30 + 15 * Math.sin(y * 0.011 + 0.7) + 5 * Math.sin(y * 0.026);
  const branchY = (i: number) => H * (i + 0.5) / SECTIONS;

  function build() {
    H = window.innerHeight;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    canvas!.style.width = `${W}px`;
    canvas!.style.height = `${H}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    const n = Math.max(16, Math.round(H / 24));
    drops = new Array(n).fill(0).map(() => ({
      y: Math.random() * H,
      sp: 0.25 + Math.random() * 0.55,
      ch: pick(),
      a: 0.05 + Math.random() * 0.13,
    }));
  }

  function activeIndex(): number {
    const dots = host!.querySelectorAll('.river-dot');
    for (let i = 0; i < dots.length; i++) if (dots[i].classList.contains('active')) return i;
    return -1;
  }

  function render(move: boolean) {
    const [r, g, b] = ink;
    ctx!.clearRect(0, 0, W, H);

    // Riverbed
    ctx!.beginPath();
    for (let y = 0; y <= H; y += 8) { const x = riverX(y); y === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y); }
    ctx!.strokeStyle = `rgba(${r},${g},${b},0.07)`;
    ctx!.lineWidth = 1;
    ctx!.stroke();

    // Branches toward each section node
    const act = activeIndex();
    for (let i = 0; i < SECTIONS; i++) {
      const by = branchY(i);
      const sx = riverX(by);
      ctx!.beginPath();
      ctx!.moveTo(sx, by);
      ctx!.quadraticCurveTo(sx + 28, by, 80, by);
      ctx!.strokeStyle = `rgba(${r},${g},${b},${i === act ? 0.24 : 0.07})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    // Flowing glyphs
    ctx!.font = '600 12px "Space Mono", monospace';
    for (const d of drops) {
      if (move) { d.y += d.sp; if (d.y > H + 12) { d.y = -12; d.ch = pick(); } }
      ctx!.fillStyle = `rgba(${r},${g},${b},${d.a})`;
      ctx!.fillText(d.ch, riverX(d.y), d.y);
    }
  }

  let raf = 0;
  let last = 0;
  let running = true;

  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    if (t - last < 33) return;
    last = t;
    render(true);
  }

  let resizeT = 0;
  const onResize = () => { clearTimeout(resizeT); resizeT = window.setTimeout(() => { build(); if (reduced) render(false); }, 150); };
  const onTheme = () => { ink = readInk(); if (reduced) render(false); };
  const onVis = () => { running = !document.hidden; };

  window.addEventListener('resize', onResize);
  window.addEventListener('themechange', onTheme);
  document.addEventListener('visibilitychange', onVis);

  build();
  if (reduced) render(false);
  else raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeT);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('themechange', onTheme);
    document.removeEventListener('visibilitychange', onVis);
    ctx!.clearRect(0, 0, W, H);
  };
}
