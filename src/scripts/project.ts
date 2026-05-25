import { getLenis } from './motion/smoothScroll';

// Case-study interactivity: copy buttons + desktop/mobile TOC with scroll-sync.
// Ported from Project.js with a teardown for Astro view transitions.
export function initProject(reduced: boolean): () => void {
  const cleanups: Array<() => void> = [];
  const created: Element[] = [];

  // --- Copy buttons ---
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
    const sel = button.getAttribute('data-copy');
    const target = sel ? document.querySelector<HTMLElement>(sel) : null;
    if (!target) return;
    const onClick = async () => {
      const text = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      button.setAttribute('data-copied', 'true');
      setTimeout(() => button.removeAttribute('data-copied'), 1500);
    };
    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  // --- TOC ---
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h2[id]'));
  if (!headings.length) return () => cleanups.forEach((c) => c());

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = window.innerWidth >= 1024 ? 40 : 96;
    const lenis = getLenis();
    if (lenis && !reduced) lenis.scrollTo(target, { offset: -offset });
    else {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  const tocContainer = document.getElementById('toc');
  if (tocContainer) {
    const list = document.createElement('ul');
    headings.forEach((h) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = (h.textContent || '').trim();
      a.className = 'toc-link';
      const onClick = (e: Event) => { e.preventDefault(); scrollTo(h.id); };
      a.addEventListener('click', onClick);
      cleanups.push(() => a.removeEventListener('click', onClick));
      li.appendChild(a);
      list.appendChild(li);
    });
    tocContainer.innerHTML = '';
    tocContainer.appendChild(list);
  }

  // Mobile TOC (appended to body — must be removed on teardown).
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-toc-menu';
  mobileMenu.id = 'mobile-toc-menu';
  const mobileNav = document.createElement('nav');
  headings.forEach((h) => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = (h.textContent || '').trim();
    a.className = 'mobile-toc-link';
    const onClick = (e: Event) => { e.preventDefault(); scrollTo(h.id); mobileMenu.classList.remove('is-open'); };
    a.addEventListener('click', onClick);
    mobileNav.appendChild(a);
  });
  mobileMenu.appendChild(mobileNav);
  document.body.appendChild(mobileMenu);
  created.push(mobileMenu);

  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-toc-toggle';
  mobileToggle.setAttribute('aria-label', 'Table of contents');
  mobileToggle.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>';
  const onToggle = () => mobileMenu.classList.toggle('is-open');
  mobileToggle.addEventListener('click', onToggle);
  document.body.appendChild(mobileToggle);
  created.push(mobileToggle);

  let observer: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = (entry.target as HTMLElement).id;
        tocContainer?.querySelectorAll('.toc-link').forEach((l) =>
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        mobileMenu.querySelectorAll('.mobile-toc-link').forEach((l) =>
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }),
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer!.observe(h));
  }

  return () => {
    cleanups.forEach((c) => c());
    observer?.disconnect();
    created.forEach((el) => el.remove());
    if (tocContainer) tocContainer.innerHTML = '';
  };
}
