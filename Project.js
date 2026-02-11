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
  if (!tocContainer || !headings.length) return;

  const list = document.createElement('ul');

  headings.forEach((heading) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    link.className = 'toc-link';

    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(heading.id);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });
    });

    listItem.appendChild(link);
    list.appendChild(listItem);
  });

  tocContainer.innerHTML = '';
  tocContainer.appendChild(list);

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          tocContainer.querySelectorAll('.toc-link').forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
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