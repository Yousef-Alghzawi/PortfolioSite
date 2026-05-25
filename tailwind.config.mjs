/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    fontFamily: {
      // Editorial display serif for expressive headlines (new)
      serif: ['"Fraunces"', 'Georgia', 'serif'],
      // Existing heading font retained for migrated pages
      display: ['"Space Mono"', 'monospace'],
      sans: ['"Inter"', 'sans-serif'],
      mono: ['"Space Mono"', 'monospace'],
    },
    extend: {
      colors: {
        slatebase: '#524E53',
        slateDeep: '#2A282B',
        uiGray: '#D6CBDA',
        // Consolidated to match styles.css --orange (#8650AB)
        brandOrange: '#8650AB',
        brandOrange2: '#9B65C0',
        brandGreen: '#CEDC57',
        brandGreen2: '#E1EB8D',
      },
    },
  },
  plugins: [],
};
