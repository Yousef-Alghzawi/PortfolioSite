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
        // "Data is a living thing" — warm paper + ink, with restrained accents.
        paper: '#F2EEE4',
        paperRaised: '#FBF9F3',
        paperSunken: '#E8E1D1',
        ink: '#1A1813',
        inkSoft: '#46423A',
        inkMuted: '#6E6A5E',
        inkFaint: '#9A9489',
        line: '#D9D2C1',
        lineStrong: '#C5BCA6',
        accent: '#6A3C99',
        accent2: '#8650AB',
        signal: '#5F6B1B',
      },
      maxWidth: {
        page: '1240px',
      },
    },
  },
  plugins: [],
};
