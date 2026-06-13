import { getLenis } from './smoothScroll';

// Active-nav tracking, mobile menu, back-to-top, anchor scroll, theme toggle.
export function initNav(reduced: boolean): () => void {
  const cleanups: Array<() => void> = [];
  const on = (el: Element | Window, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    el.addEventListener(type, fn, opts);
    cleanups.push(() => el.removeEventListener(type, fn, opts));
  };

  // --- Mobile menu ---
  const menuBtn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const iconPath = document.getElementById('menu-icon-path');
  const setMenu = (open: boolean) => {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (iconPath) iconPath.setAttribute('d', open ? 'M6 18L18 6M6 6l12 12' : 'M5 7h14M5 12h14M5 17h14');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const closeMenu = () => setMenu(false);
  if (menuBtn && menu) {
    on(menuBtn, 'click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((a) => on(a, 'click', closeMenu));
  }

  // --- Back to top ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    on(window, 'scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    on(backToTop, 'click', () => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  // --- Anchor scroll with offset (Lenis-aware), handles same-page hash links
  //     whether bare ("#work") or base-prefixed ("/PortfolioSite/#work"). ---
  const hashId = (href: string | null): string | null => {
    if (!href) return null;
    const i = href.indexOf('#');
    if (i < 0) return null;
    return decodeURIComponent(href.slice(i + 1)) || null;
  };
  const isSamePage = (link: HTMLAnchorElement): boolean => {
    try {
      const url = new URL(link.href, window.location.href);
      return url.pathname === window.location.pathname && !!url.hash;
    } catch { return false; }
  };

  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((link) => {
    if (!isSamePage(link)) return;
    on(link, 'click', (event) => {
      const id = hashId(link.getAttribute('href'));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      const offset = window.innerWidth >= 1024 ? 40 : 96;
      const go = () => {
        const lenis = getLenis();
        if (lenis && !reduced) lenis.scrollTo(target, { offset: -offset });
        else {
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
        }
      };
      if (window.innerWidth < 1024) { closeMenu(); requestAnimationFrame(go); }
      else go();
    });
  });

  // --- Active nav state ---
  const navLinks = Array.from(document.querySelectorAll<HTMLElement>('.nav-link, .mobile-nav-link'));
  let observer: IntersectionObserver | null = null;
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sections = Array.from(
      new Set(
        navLinks
          .map((l) => {
            const id = hashId(l.getAttribute('href'));
            return id ? document.getElementById(id) : null;
          })
          .filter(Boolean) as HTMLElement[]
      )
    );
    if (sections.length) {
      const setActive = (id: string) => {
        navLinks.forEach((l) => {
          const match = hashId(l.getAttribute('href')) === id;
          l.classList.toggle('active', match);
          if (match) l.setAttribute('aria-current', 'page');
          else l.removeAttribute('aria-current');
        });
      };
      observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).id)),
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      sections.forEach((s) => observer!.observe(s));
    }
  }

  // --- Theme toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const apply = (theme: string) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      document.querySelector('.theme-icon-sun')?.classList.toggle('hidden', theme === 'light');
      document.querySelector('.theme-icon-moon')?.classList.toggle('hidden', theme !== 'light');
      window.dispatchEvent(new Event('themechange'));
    };
    apply(document.documentElement.getAttribute('data-theme') || 'light');
    on(themeToggle, 'click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'light' ? 'dark' : 'light');
    });
  }

  return () => {
    cleanups.forEach((c) => c());
    observer?.disconnect();
    document.body.style.overflow = '';
  };
}
