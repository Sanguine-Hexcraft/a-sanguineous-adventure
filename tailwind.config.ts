import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{vue,ts}',
    './content/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#09071a',
          900: '#0d0a22',
          800: '#14102e',
          700: '#1c1840',
          600: '#251f52',
        },
        parchment: {
          100: '#f5edd5',
          200: '#e8d8b0',
          300: '#c4a86a',
        },
        rune: {
          400: '#f0c040',
          500: '#c8962a',
          600: '#7a5c18',
        },
        blood: {
          500: '#e84040',
          600: '#b02828',
        },
        mana: {
          400: '#00bbcc',
          500: '#007a8a',
        },
        arcane: {
          300: '#c4a0ff',
          400: '#9b5de5',
          500: '#7240c0',
          600: '#4a2880',
        },
        jade: {
          400: '#3dd68c',
          500: '#1fa862',
        },
      },
      fontFamily: {
        display: ['Palatino Linotype', 'Palatino', 'Book Antiqua', 'Georgia', 'serif'],
        body: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'rune': '0 0 16px rgba(240, 192, 64, 0.45)',
        'rune-lg': '0 0 32px rgba(240, 192, 64, 0.55)',
        'arcane': '0 0 16px rgba(155, 93, 229, 0.45)',
        'arcane-lg': '0 0 28px rgba(155, 93, 229, 0.55)',
        'mana': '0 0 16px rgba(0, 187, 204, 0.35)',
      }
    },
  },
  plugins: [typography],
} satisfies Config
