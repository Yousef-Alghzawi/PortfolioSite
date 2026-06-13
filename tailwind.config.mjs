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
        accent: '#BC511A',
        accent2: '#D9692E',
        blue: '#1B5A78',
        blue2: '#2B7DA3',
        signal: '#1B5A78',
      },
      maxWidth: {
        page: '1240px',
      },
    },
  },
  plugins: [],
};
