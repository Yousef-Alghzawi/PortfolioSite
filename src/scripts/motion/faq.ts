// Smooth <details> accordion for #faq (ported from script.js).
export function initFaq(reduced: boolean): () => void {
  const faq = document.getElementById('faq');
  if (!faq) return () => {};

  const detailsList = Array.from(faq.querySelectorAll('details'));
  if (!detailsList.length) return () => {};

  const listeners: Array<{ el: Element; type: string; fn: EventListener }> = [];
  const pending = new Map<HTMLDetailsElement, { panel: HTMLElement; onEnd: EventListener }>();

  const directChild = (parent: Element, pred: (el: Element) => boolean) => {
    for (const child of Array.from(parent.children)) if (pred(child)) return child as HTMLElement;
    return null;
  };
  const getPanel = (d: Element) => directChild(d, (el) => el.classList.contains('faq-panel'));
  const setA11y = (panel: HTMLElement, open: boolean) => {
    if (open) { panel.removeAttribute('aria-hidden'); (panel as any).inert = false; }
    else { panel.setAttribute('aria-hidden', 'true'); (panel as any).inert = true; }
  };

  const ensurePanel = (d: HTMLDetailsElement) => {
    const summary = directChild(d, (el) => el.tagName === 'SUMMARY');
    if (!summary) return null;
    let panel = getPanel(d);
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'faq-panel';
    while (summary.nextSibling) panel.appendChild(summary.nextSibling);
    d.appendChild(panel);
    return panel;
  };

  const clearPending = (d: HTMLDetailsElement) => {
    const cur = pending.get(d);
    if (cur) { cur.panel.removeEventListener('transitionend', cur.onEnd); pending.delete(d); }
  };

  const open = (d: HTMLDetailsElement, panel: HTMLElement) => {
    clearPending(d); setA11y(panel, true);
    d.open = true;
    panel.style.height = 'auto';
    const target = panel.getBoundingClientRect().height;
    panel.style.height = '0px';
    panel.getBoundingClientRect();
    requestAnimationFrame(() => { panel.style.height = `${target}px`; });
    const onEnd = (e: Event) => {
      const te = e as TransitionEvent;
      if (te.target !== panel || te.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.style.height = 'auto'; pending.delete(d);
    };
    pending.set(d, { panel, onEnd });
    panel.addEventListener('transitionend', onEnd);
  };

  const close = (d: HTMLDetailsElement, panel: HTMLElement) => {
    clearPending(d); setA11y(panel, false);
    panel.style.height = `${panel.getBoundingClientRect().height}px`;
    d.open = false;
    panel.getBoundingClientRect();
    requestAnimationFrame(() => { panel.style.height = '0px'; });
    const onEnd = (e: Event) => {
      const te = e as TransitionEvent;
      if (te.target !== panel || te.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      pending.delete(d);
    };
    pending.set(d, { panel, onEnd });
    panel.addEventListener('transitionend', onEnd);
  };

  detailsList.forEach((d) => {
    const summary = directChild(d, (el) => el.tagName === 'SUMMARY');
    const panel = ensurePanel(d);
    if (!summary || !panel) return;
    if (d.open) { panel.style.height = 'auto'; setA11y(panel, true); }
    else { panel.style.height = '0px'; setA11y(panel, false); }

    const fn: EventListener = (e) => {
      e.preventDefault();
      const isOpen = d.hasAttribute('open');
      if (reduced) {
        clearPending(d);
        d.open = !isOpen;
        panel.style.height = isOpen ? '0px' : 'auto';
        setA11y(panel, !isOpen);
        return;
      }
      isOpen ? close(d, panel) : open(d, panel);
    };
    summary.addEventListener('click', fn);
    listeners.push({ el: summary, type: 'click', fn });
  });

  return () => {
    listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
    pending.forEach((_, d) => clearPending(d));
  };
}
