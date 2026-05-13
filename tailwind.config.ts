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
          950: '#06050a',
          900: '#0d0b14',
          800: '#16131f',
          700: '#201c2e',
          600: '#2c2640',
        },
        parchment: {
          100: '#f5ead6',
          200: '#e8d5b0',
          300: '#c9a96e',
        },
        rune: {
          400: '#c49a3c',
          500: '#a87d28',
          600: '#7a5a1a',
        },
        blood: {
          500: '#8b1a1a',
          600: '#6b1313',
        },
        mana: {
          400: '#5b7fa6',
          500: '#3d5f80',
        }
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
        'rune': '0 0 12px rgba(196, 154, 60, 0.3)',
        'rune-lg': '0 0 24px rgba(196, 154, 60, 0.4)',
      }
    },
  },
  plugins: [typography],
} satisfies Config
