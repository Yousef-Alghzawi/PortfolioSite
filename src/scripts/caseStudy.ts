import Prism from 'prismjs';
import 'prismjs/components/prism-r';
import { initProject } from './project';

let cleanup: () => void = () => {};

function run() {
  cleanup();
  if (!document.querySelector('[data-case-study]')) return;
  Prism.highlightAll();
  cleanup = initProject(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

document.addEventListener('astro:page-load', run);
document.addEventListener('astro:before-swap', () => { cleanup(); cleanup = () => {}; });
