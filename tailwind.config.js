/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        main: 'var(--text-main)',
        muted: 'var(--text-muted)',
        'input-bg': 'var(--bg-input)',

        plum: {
          DEFAULT: 'var(--color-plum)',
          hover: 'var(--color-plum-hover)',
          light: 'var(--color-plum-light)',
          scroll: 'var(--color-plum-scroll)',
          'scroll-hover': 'var(--color-plum-scroll-hover)',
        },
        mint: {
          DEFAULT: 'var(--color-mint)',
          dark: 'var(--color-mint-dark)',
          light: 'var(--color-mint-light)',
          hover: 'var(--color-mint-hover)',
        },
        cream: {
          DEFAULT: 'var(--color-cream)',
          dark: 'var(--color-cream-dark)',
          light: 'var(--color-cream-light)',
          input: 'var(--color-cream-input)',
        },
        mauve: {
          DEFAULT: 'var(--color-mauve)',
          dark: 'var(--color-mauve-dark)',
          light: 'var(--color-mauve-light)',
        },
      },
    },
  },
  plugins: [],
}