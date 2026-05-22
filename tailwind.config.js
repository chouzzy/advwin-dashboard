/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        copper: {
          DEFAULT: '#C4845A',
          light:   '#D49570',
          dark:    '#8C5C3A',
          faint:   '#2A1A0E',
        },
        dark: {
          bg:  '#0A0A0A',
          1:   '#111111',
          2:   '#181818',
          3:   '#202020',
          4:   '#2A2A2A',
          b:   '#242424',
          b2:  '#2E2E2E',
        },
        ink: {
          1: '#F0EBE5',
          2: '#9A9087',
          3: '#585450',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '10px',
        xl: '14px',
      },
    },
  },
  plugins: [],
}
