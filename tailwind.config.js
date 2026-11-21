/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a14',
          900: '#0a0f1d',
          850: '#0d1527',
          800: '#111b33',
        },
        brand: {
          blue: '#2563eb',
          royal: '#1d4ed8',
          vibrant: '#2b66ff',
          light: '#eef2ff',
          ice: '#f0f5ff',
          accent: '#38bdf8',
        },
        surface: {
          light: '#f4f6fa',
          card: '#ffffff',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
