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
  mobileMenu.classList.toggle('hidden', !open);
};

const closeMobileMenu = () => setMobileMenuState(false);

const toggleMobileMenu = () => {
  if (!mobileMenuButton || !mobileMenu) return;
  const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  setMobileMenuState(!expanded);
};

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

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
    });

    if (window.innerWidth < 1024) {
      closeMobileMenu();
    }
  };

  anchorLinks.forEach((link) => link.addEventListener('click', handleClick));
})();

// Active nav state on scroll
(() => {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

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
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = ease * target;
      counter.textContent = prefix + current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = prefix + target.toFixed(decimals);
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
