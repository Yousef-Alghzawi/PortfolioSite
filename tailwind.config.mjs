/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    fontFamily: {
      serif: ['"Fraunces"', 'Georgia', 'serif'],
      display: ['"Fraunces"', 'Georgia', 'serif'],
      sans: ['"Inter"', 'sans-serif'],
      mono: ['"Space Mono"', 'monospace'],
    },
    extend: {
      colors: {
        // Mapped to CSS variables so light/dark theming works everywhere.
        paper: 'var(--paper)',
        paperRaised: 'var(--paper-raised)',
        paperSunken: 'var(--paper-sunken)',
        ink: 'var(--ink)',
        inkSoft: 'var(--ink-soft)',
        inkMuted: 'var(--ink-muted)',
        inkFaint: 'var(--ink-faint)',
        line: 'var(--line)',
        lineStrong: 'var(--line-strong)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        signal: 'var(--signal)',
      },
      maxWidth: {
        page: '1240px',
      },
    },
  },
  plugins: [],
};
