// =====================================================================
// LIVING SYMBOL FIELD
// A grid of statistical / data-science glyphs rendered to <canvas>.
// It breathes (a slow brightness wave), mutates (glyphs flicker and
// recompute), and reacts to the pointer like a parting point cloud —
// glyphs near the cursor brighten, magnify, tint toward the accent, and
// scatter outward. The "data is a living thing" centrepiece.
// Returns a dispose() to match the motion lifecycle.
// =====================================================================

// Weighted toward symbols a biostatistician actually lives in.
const GLYPHS = (
  'βββσσσμμμλλθθπππχχΣΣΣ' +      // common stats Greek (weighted)
  'αγδεζηικνξρτφψωΠ' +           // remaining Greek
  '∫∂∇√∞≈≠≤≥±×÷∝∈∉∪∩⊂∀∃→↦⊕⊗∑∏' + // operators
  '0123456789' +                  // digits
  '.·%|/²·p̂·'                    // punctuation / hats
).split('');

const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

interface Cell {
  ch: string;
  base: number;   // base alpha 0..1
  phase: number;  // wave phase offset
  flash: number;  // transient brightness from a "recompute" flicker
}

const INK = [26, 24, 19];      // --ink
const ACCENT = [106, 60, 153]; // --accent

export function initSymbolField(host: HTMLElement): () => void {
  const canvas = host.querySelector<HTMLCanvasElement>('.symbol-field');
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  // Grid sizing — clamp total cells for performance.
  let cellW = 24;
  let cellH = 28;
  let cols = 0;
  let rows = 0;
  let grid: Cell[] = [];
  let w = 0;
  let h = 0;

  const pointer = { x: -9999, y: -9999, active: false };
  // Virtual pointer drives the effect on touch / when idle.
  const phantom = { x: 0, y: 0 };

  function build() {
    const rect = host.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);

    // Adapt density: aim for legible glyphs, cap the cell count.
    const target = w < 640 ? 30 : 26;
    cellW = target;
    cellH = Math.round(target * 1.16);
    cols = Math.ceil(w / cellW) + 1;
    rows = Math.ceil(h / cellH) + 1;

    // Hard cap (keeps fillText cost bounded on huge screens).
    const MAX = 2400;
    while (cols * rows > MAX) {
      cellW += 2;
      cellH = Math.round(cellW * 1.16);
      cols = Math.ceil(w / cellW) + 1;
      rows = Math.ceil(h / cellH) + 1;
    }

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';

    grid = new Array(cols * rows);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = {
        ch: pick(),
        base: 0.04 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        flash: 0,
      };
    }
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  let raf = 0;
  let last = 0;
  let running = true;
  const fontSize = () => Math.round(Math.min(cellW, cellH) * 0.74);

  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    // ~33fps gate — plenty smooth for a drifting field, easy on the CPU.
    if (t - last < 30) return;
    last = t;

    const time = t * 0.001;

    // Idle / touch: glide a phantom pointer along a Lissajous path.
    if (!pointer.active) {
      phantom.x = w * (0.5 + 0.34 * Math.sin(time * 0.37));
      phantom.y = h * (0.5 + 0.3 * Math.cos(time * 0.29));
    }
    const px = pointer.active ? pointer.x : phantom.x;
    const py = pointer.active ? pointer.y : phantom.y;
    const R = Math.min(w, h) * (pointer.active ? 0.26 : 0.32);
    const R2 = R * R;

    ctx!.clearRect(0, 0, w, h);
    ctx!.font = `600 ${fontSize()}px "Space Mono", ui-monospace, monospace`;

    for (let r = 0; r < rows; r++) {
      const cy = r * cellH + cellH * 0.5;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const cell = grid[i];
        const cx = c * cellW + cellW * 0.5;

        // Breathing wave travelling diagonally across the field.
        const wave = 0.06 * (0.5 + 0.5 * Math.sin(time * 0.9 + cell.phase + (cx + cy) * 0.004));

        // Pointer proximity → magnify / tint / scatter.
        const dx = cx - px;
        const dy = cy - py;
        const d2 = dx * dx + dy * dy;
        let prox = 0;
        let ox = 0;
        let oy = 0;
        if (d2 < R2) {
          const dist = Math.sqrt(d2);
          const f = 1 - dist / R;
          prox = f * f;
          const inv = dist > 1 ? 1 / dist : 0;
          const push = prox * 10;  // radial scatter
          const swirl = prox * 9;  // tangential vortex (matches the reference)
          ox = dx * inv * push - dy * inv * swirl;
          oy = dy * inv * push + dx * inv * swirl;
        }

        if (cell.flash > 0) cell.flash *= 0.9;

        let alpha = cell.base + wave + prox * 0.6 + cell.flash;
        if (alpha < 0.015) continue;
        if (alpha > 0.92) alpha = 0.92;

        // Colour: ink, lerping toward accent for cells under the lens.
        const tint = prox * 0.85;
        const cr = lerp(INK[0], ACCENT[0], tint);
        const cg = lerp(INK[1], ACCENT[1], tint);
        const cb = lerp(INK[2], ACCENT[2], tint);
        ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha.toFixed(3)})`;

        if (prox > 0.02) {
          const scale = 1 + prox * 0.55;
          ctx!.save();
          ctx!.translate(cx + ox, cy + oy);
          ctx!.rotate(prox * 0.6);
          ctx!.scale(scale, scale);
          ctx!.fillText(cell.ch, 0, 0);
          ctx!.restore();
        } else {
          ctx!.fillText(cell.ch, cx, cy);
        }
      }
    }

    // "Recompute" flicker — a few glyphs mutate each tick, brightening briefly.
    const mutations = 2 + ((Math.random() * 3) | 0);
    for (let m = 0; m < mutations; m++) {
      const idx = (Math.random() * grid.length) | 0;
      const cell = grid[idx];
      if (cell) { cell.ch = pick(); cell.flash = 0.45; }
    }
  }

  // --- events -----------------------------------------------------------
  const onMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
  };
  const onLeave = () => { pointer.active = false; };

  if (finePointer) {
    window.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
  }

  let resizeT = 0;
  const onResize = () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(build, 150);
  };
  window.addEventListener('resize', onResize);

  // Pause when the hero scrolls out of view.
  const io = new IntersectionObserver(
    (entries) => { running = entries[0]?.isIntersecting ?? true; },
    { threshold: 0 }
  );
  io.observe(host);

  build();
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeT);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    io.disconnect();
    ctx!.clearRect(0, 0, w, h);
  };
}
