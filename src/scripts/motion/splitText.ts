// Lightweight, dependency-free line/word splitter for GSAP reveals.
// (GSAP SplitText is a paid plugin; this covers our needs.)

export interface SplitResult {
  lines: HTMLElement[];
  restore: () => void;
}

// Wrap each word in spans, then group words into visual lines based on offsetTop.
export function splitLines(el: HTMLElement): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const words = text.split(/(\s+)/);

  el.textContent = '';
  const wordSpans: HTMLElement[] = [];
  for (const w of words) {
    if (w.trim() === '') {
      el.appendChild(document.createTextNode(w));
      continue;
    }
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = w;
    el.appendChild(span);
    wordSpans.push(span);
  }

  // Group by top offset into lines.
  const lineGroups: HTMLElement[][] = [];
  let lastTop: number | null = null;
  for (const span of wordSpans) {
    const top = span.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lineGroups.push([]);
      lastTop = top;
    }
    lineGroups[lineGroups.length - 1].push(span);
  }

  // Rebuild as .split-line > .split-inner wrappers.
  el.textContent = '';
  const lines: HTMLElement[] = [];
  lineGroups.forEach((group) => {
    const line = document.createElement('span');
    line.className = 'split-line';
    const inner = document.createElement('span');
    inner.className = 'split-inner';
    group.forEach((s, i) => {
      inner.appendChild(s);
      if (i < group.length - 1) inner.appendChild(document.createTextNode(' '));
    });
    line.appendChild(inner);
    el.appendChild(line);
    el.appendChild(document.createTextNode(' '));
    lines.push(inner);
  });

  return {
    lines,
    restore: () => { el.innerHTML = original; },
  };
}
