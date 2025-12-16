import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,mdx,md,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [typography()],
};
