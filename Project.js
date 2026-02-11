const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const DEFAULT_SLUG = 'PROJECT_SLUG';

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initToc();
  window.setImagePaths(DEFAULT_SLUG);
});

function initCopyButtons() {
  const buttons = document.querySelectorAll('[data-copy]');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const targetSelector = button.getAttribute('data-copy');
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) return;

    button.addEventListener('click', async () => {
      const codeText = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(codeText);
        showCopiedState(button);
      } catch (error) {
        fallbackCopy(codeText);
        showCopiedState(button);
      }
    });
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showCopiedState(button) {
  button.setAttribute('data-copied', 'true');
  setTimeout(() => {
    button.removeAttribute('data-copied');
  }, 1500);
}

function initToc() {
  const tocContainer = document.getElementById('toc');
  const headings = Array.from(document.querySelectorAll('h2[id]'));
  if (!headings.length) return;

  // Desktop ToC
  if (tocContainer) {
    const list = document.createElement('ul');
    headings.forEach((heading) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      link.className = 'toc-link';
      link.addEventListener('click', (e) => handleTocClick(e, heading.id));
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    tocContainer.innerHTML = '';
    tocContainer.appendChild(list);
  }

  // Mobile ToC setup
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-toc-menu';
  mobileMenu.id = 'mobile-toc-menu';
  
  const mobileList = document.createElement('nav');
  headings.forEach((heading) => {
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    link.className = 'mobile-toc-link';
    link.addEventListener('click', (e) => {
      handleTocClick(e, heading.id);
      mobileMenu.classList.remove('is-open');
    });
    mobileList.appendChild(link);
  });
  
  mobileMenu.appendChild(mobileList);
  document.body.appendChild(mobileMenu);

  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-toc-toggle';
  mobileToggle.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>';
  mobileToggle.addEventListener('click', () => mobileMenu.classList.toggle('is-open'));
  document.body.appendChild(mobileToggle);

  function handleTocClick(event, id) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const offset = window.innerWidth >= 1024 ? 40 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          // Sync Desktop
          if (tocContainer) {
            tocContainer.querySelectorAll('.toc-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
          }
          // Sync Mobile
          mobileMenu.querySelectorAll('.mobile-toc-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  headings.forEach((heading) => observer.observe(heading));
}

function setImagePaths(slug) {
  const sanitizedSlug = slug || DEFAULT_SLUG;
  const basePath = `assets/projects/${sanitizedSlug}/`;

  document.querySelectorAll('img[data-slug]').forEach((img) => {
    const relativePath = img.getAttribute('data-slug');
    if (!relativePath) return;
    img.src = `${basePath}${relativePath}`;
  });

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute('content', `${basePath}og-image.jpg`);
  }
}

window.setImagePaths = setImagePaths;