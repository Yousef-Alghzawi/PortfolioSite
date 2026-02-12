// Force scroll to top on load to prevent browser scroll restoration / layout-shift scroll offsets.
(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const hasHashTarget = () => {
    const hash = window.location.hash;
    if (!hash || hash === '#') return false;
    const id = decodeURIComponent(hash.slice(1));
    return Boolean(document.getElementById(id));
  };

  const scrollToTopInstant = () => {
    if (hasHashTarget()) return;

    const prevHtmlBehavior = document.documentElement.style.scrollBehavior;
    const prevBodyBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.documentElement.style.scrollBehavior = prevHtmlBehavior;
    document.body.style.scrollBehavior = prevBodyBehavior;
  };

  // Run immediately, then again after layout settles (fonts/images) and on bfcache restores.
  scrollToTopInstant();
  window.addEventListener('load', () => {
    scrollToTopInstant();
    setTimeout(scrollToTopInstant, 50);
  }, { once: true });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      scrollToTopInstant();
      setTimeout(scrollToTopInstant, 50);
    }
  });
})();

// Update year for footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- Seamless Page Transitions ---
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Intercept clicks on internal navigation links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Skip anchors, external links, mailto, tel, and javascript
    if (!href
      || href.startsWith('#')
      || href.startsWith('mailto:')
      || href.startsWith('tel:')
      || href.startsWith('javascript:')
      || link.target === '_blank'
      || link.hasAttribute('download')
      || e.ctrlKey || e.metaKey || e.shiftKey
    ) return;

    // Skip external URLs
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
    } catch (_) {
      return;
    }

    e.preventDefault();

    // Use View Transitions API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = href;
      });
      return;
    }

    // Fallback: overlay fade
    overlay.classList.add('is-leaving');
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });

  // On page show (back/forward cache), remove overlay
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      overlay.classList.remove('is-leaving');
    }
  });
})();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

const setMobileMenuState = (open) => {
  if (!mobileMenuButton || !mobileMenu) return;
  mobileMenuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('is-open', open);
  
  // Update icon from hamburger to X
  const path = document.getElementById('menu-icon-path');
  if (path) {
    if (open) {
      path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
      path.setAttribute('d', 'M5 7h14M5 12h14M5 17h14');
    }
  }

  // Prevent scrolling when menu is open
  document.body.style.overflow = open ? 'hidden' : '';
};

const closeMobileMenu = () => setMobileMenuState(false);

const toggleMobileMenu = () => {
  if (!mobileMenuButton || !mobileMenu) return;
  const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  setMobileMenuState(!expanded);
};

// Back to Top functionality
(() => {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

// Mobile menu toggle
(() => {
  if (!mobileMenuButton || !mobileMenu) return;
  mobileMenuButton.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking a link
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
})();

// Smooth scrolling with offset
(() => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  if (!anchorLinks.length) return;

  const handleClick = (event) => {
    const link = event.currentTarget;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    const offset = window.innerWidth >= 1024 ? 40 : 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

    const scrollToTarget = () => {
      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });
    };

    // Close the mobile menu first so body scroll lock doesn't block scrolling on mobile browsers.
    if (window.innerWidth < 1024) {
      closeMobileMenu();
      requestAnimationFrame(scrollToTarget);
      return;
    }

    scrollToTarget();
  };

  anchorLinks.forEach((link) => link.addEventListener('click', handleClick));
})();

// Active nav state on scroll
(() => {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const sectionSet = new Set(
    Array.from(navLinks)
    .map((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return null;
      const id = href.slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean)
  );
  const sections = Array.from(sectionSet);

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

// FAQ accordions (smooth <details> open/close)
(() => {
  const faq = document.getElementById('faq');
  if (!faq) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const detailsList = Array.from(faq.querySelectorAll('details'));
  if (!detailsList.length) return;

  const state = new WeakMap();

  const setPanelA11y = (panel, open) => {
    if (!panel) return;
    if (open) {
      panel.removeAttribute('aria-hidden');
      if ('inert' in panel) panel.inert = false;
    } else {
      panel.setAttribute('aria-hidden', 'true');
      if ('inert' in panel) panel.inert = true;
    }
  };

  const getDirectChild = (parent, predicate) => {
    for (const child of parent.children) {
      if (predicate(child)) return child;
    }
    return null;
  };

  const getPanel = (details) =>
    getDirectChild(details, (el) => el.classList && el.classList.contains('faq-panel'));

  const ensurePanel = (details) => {
    const summary = getDirectChild(details, (el) => el.tagName === 'SUMMARY');
    if (!summary) return null;

    let panel = getPanel(details);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.className = 'faq-panel';

    while (summary.nextSibling) {
      panel.appendChild(summary.nextSibling);
    }
    details.appendChild(panel);
    return panel;
  };

  const cleanupTransition = (details) => {
    const current = state.get(details);
    if (!current) return;
    if (current.onEnd) current.panel.removeEventListener('transitionend', current.onEnd);
    state.delete(details);
  };

  const animateOpen = (details, panel) => {
    cleanupTransition(details);
    setPanelA11y(panel, true);

    details.open = true;
    panel.style.height = '0px';

    panel.style.height = 'auto';
    const targetHeight = panel.getBoundingClientRect().height;
    panel.style.height = '0px';
    panel.getBoundingClientRect();

    requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
    });

    const onEnd = (e) => {
      if (e.target !== panel || e.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.style.height = 'auto';
      state.delete(details);
    };

    state.set(details, { panel, onEnd });
    panel.addEventListener('transitionend', onEnd);
  };

  const animateClose = (details, panel) => {
    cleanupTransition(details);
    setPanelA11y(panel, false);

    const startHeight = panel.getBoundingClientRect().height;
    panel.style.height = `${startHeight}px`;

    details.open = false;

    panel.getBoundingClientRect();
    requestAnimationFrame(() => {
      panel.style.height = '0px';
    });

    const onEnd = (e) => {
      if (e.target !== panel || e.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      state.delete(details);
    };

    state.set(details, { panel, onEnd });
    panel.addEventListener('transitionend', onEnd);
  };

  const toggle = (details) => {
    const panel = ensurePanel(details);
    if (!panel) return;

    const isOpen = details.hasAttribute('open');

    if (reduceMotion) {
      cleanupTransition(details);
      if (isOpen) {
        details.open = false;
        panel.style.height = '0px';
        setPanelA11y(panel, false);
      } else {
        details.open = true;
        panel.style.height = 'auto';
        setPanelA11y(panel, true);
      }
      return;
    }

    if (isOpen) {
      animateClose(details, panel);
    } else {
      animateOpen(details, panel);
    }
  };

  detailsList.forEach((details) => {
    const summary = getDirectChild(details, (el) => el.tagName === 'SUMMARY');
    if (!summary) return;
    const panel = ensurePanel(details);
    if (!panel) return;

    if (details.open) {
      panel.style.height = 'auto';
      setPanelA11y(panel, true);
    } else {
      panel.style.height = '0px';
      setPanelA11y(panel, false);
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      toggle(details);
    });
  });
})();

// Reveal-on-scroll animations
(() => {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;

  const showImmediately = !('IntersectionObserver' in window) || prefersReducedMotion.matches;

  if (showImmediately) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
})();

// Number Counting Animation
(() => {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = ease * target;
      counter.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();
