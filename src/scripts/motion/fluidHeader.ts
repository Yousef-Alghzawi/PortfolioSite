import { Renderer, Triangle, Program, Mesh, Texture } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  void main() {
    vec2 uv = vUv;
    float d = distance(uv, uMouse);
    float falloff = smoothstep(0.45, 0.0, d) * uHover;
    vec2 dir = normalize(uv - uMouse + 1e-5);
    uv -= dir * falloff * 0.06;
    vec3 col = texture2D(uTexture, uv).rgb;
    // subtle green signal lift where distortion is strongest
    col += vec3(0.10, 0.12, 0.03) * falloff;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initFluidHeader(container: HTMLElement): () => void {
  const src = container.getAttribute('data-fluid-header');
  if (!src) return () => {};

  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: false, dpr: Math.min(2, window.devicePixelRatio || 1) });
  } catch {
    return () => {};
  }
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  container.appendChild(canvas);

  const texture = new Texture(gl);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  img.onload = () => { texture.image = img; };

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: [0.5, 0.5] },
      uHover: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => renderer.setSize(container.clientWidth, container.clientHeight);
  resize();
  window.addEventListener('resize', resize);

  const target: [number, number] = [0.5, 0.5];
  let hoverTarget = 0;
  const onMove = (e: MouseEvent) => {
    const r = container.getBoundingClientRect();
    target[0] = (e.clientX - r.left) / r.width;
    target[1] = 1 - (e.clientY - r.top) / r.height;
    hoverTarget = 1;
  };
  const onLeave = () => { hoverTarget = 0; };
  container.addEventListener('mousemove', onMove, { passive: true });
  container.addEventListener('mouseleave', onLeave);

  let raf = 0;
  const loop = () => {
    const mu = program.uniforms.uMouse.value as [number, number];
    mu[0] += (target[0] - mu[0]) * 0.08;
    mu[1] += (target[1] - mu[1]) * 0.08;
    program.uniforms.uHover.value += (hoverTarget - program.uniforms.uHover.value) * 0.06;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseleave', onLeave);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  };
}
