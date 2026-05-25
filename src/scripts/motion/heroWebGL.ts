import { Renderer, Triangle, Program, Mesh } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uBg1;
  uniform vec3 uBg2;
  uniform vec3 uGreen;
  uniform vec3 uPurple;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);

    // Base vertical gradient (slate -> deep slate).
    vec3 col = mix(uBg2, uBg1, smoothstep(0.0, 1.0, uv.y));

    // Mouse flow field: points drift away from the pointer.
    float md = distance(p, m);
    vec2 flow = normalize(p - m + 1e-5) * 0.05 * exp(-md * 2.2);

    // Scatter of data points.
    float gridN = 20.0;
    vec2 gp = (p + flow) * gridN;
    vec2 cell = floor(gp);
    vec2 f = fract(gp);
    float dots = 0.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j));
        vec2 id = cell + o;
        vec2 rnd = vec2(hash(id), hash(id + 5.2));
        vec2 pos = o + 0.5 + 0.34 * sin(uTime * 0.4 + 6.2831 * rnd + id.x);
        float d = length(f - pos);
        float r = 0.05 + 0.03 * rnd.x;
        dots += smoothstep(r, r * 0.35, d) * (0.45 + 0.55 * rnd.y);
      }
    }
    dots = clamp(dots, 0.0, 1.0);

    // Regression line (slope reacts to mouse Y) + confidence band.
    float slope = 0.16 + (uMouse.y - 0.5) * 0.22;
    float lineY = 0.5 + slope * (uv.x - 0.5);
    float lineDist = abs(uv.y - lineY);
    float line = smoothstep(0.010, 0.0, lineDist);
    float band = smoothstep(0.07, 0.0, lineDist);

    // Compose: dim purple scatter, purple CI band, green "signal" line.
    col += mix(uPurple, uGreen, dots) * dots * 0.18;
    col += uPurple * band * 0.10;
    col += uGreen * line * 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const toRGB = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function initHeroWebGL(container: HTMLElement): () => void {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: false, dpr: Math.min(2, window.devicePixelRatio || 1) });
  } catch {
    return () => {};
  }
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.className = 'hero-canvas';
  container.appendChild(canvas);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      uBg1: { value: toRGB('#2A282B') },
      uBg2: { value: toRGB('#524E53') },
      uGreen: { value: toRGB('#CEDC57') },
      uPurple: { value: toRGB('#8650AB') },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
  };
  resize();
  window.addEventListener('resize', resize);

  const target: [number, number] = [0.5, 0.5];
  const onMove = (e: MouseEvent) => {
    const r = container.getBoundingClientRect();
    target[0] = (e.clientX - r.left) / r.width;
    target[1] = 1 - (e.clientY - r.top) / r.height;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  let raf = 0;
  let visible = true;
  const io = new IntersectionObserver(
    (entries) => { visible = entries[0].isIntersecting; if (visible) loop(0); },
    { threshold: 0 }
  );
  io.observe(container);

  const loop = (t: number) => {
    const mu = program.uniforms.uMouse.value as [number, number];
    mu[0] += (target[0] - mu[0]) * 0.06;
    mu[1] += (target[1] - mu[1]) * 0.06;
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
    if (visible) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMove);
    const ext = gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
    canvas.remove();
  };
}
