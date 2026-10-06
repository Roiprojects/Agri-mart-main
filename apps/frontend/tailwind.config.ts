import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: '#079447',
          'green-dark': '#066832',
          'green-light': '#EFF7EA',
          yellow: '#F7C629',
          'yellow-dark': '#D9A70F',
          lime: '#B4D334',
          'lime-light': '#F4F9E4',
          cream: '#FAFAF3',
          pale: '#EFF7EA',
          dark: '#183526',
          secondary: '#596B60',
          border: '#E2E8DF',
          'border-focus': '#079447',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(24, 53, 38, 0.05), 0 1px 2px -1px rgba(24, 53, 38, 0.05)',
        card: '0 4px 12px 0 rgba(24, 53, 38, 0.04), 0 2px 4px -2px rgba(24, 53, 38, 0.04)',
        hover: '0 10px 24px -3px rgba(24, 53, 38, 0.08), 0 4px 6px -4px rgba(24, 53, 38, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '16/10': '16 / 10',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        driftSlow: {
          '0%': { transform: 'translateX(0) scale(1)' },
          '50%': { transform: 'translateX(-15px) scale(1.02)' },
          '100%': { transform: 'translateX(0) scale(1)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeSlideUp: 'fadeSlideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeSlideDown: 'fadeSlideDown 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        driftSlow: 'driftSlow 18s ease-in-out infinite',
        gentlePulse: 'gentlePulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
