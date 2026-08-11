import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ktd-dark': '#00263F',
        'ktd-navy': '#003F6C',
        'ktd-blue': '#006BB2',
        'ktd-light-blue': '#C7DFEF',
        'ktd-red': '#E30613',
        'ktd-light': '#F3F5F7',
      },
      fontFamily: {
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        marquee: 'ktd-marquee 20s linear infinite',
        fadeup: 'ktd-fadeup 0.3s ease',
        toastin: 'ktd-toastin 0.3s ease',
        pulse: 'ktd-pulse 2s ease-in-out infinite',
        bounce: 'ktd-bounce 2s ease-in-out infinite',
      },
      keyframes: {
        'ktd-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'ktd-fadeup': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ktd-toastin': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ktd-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        'ktd-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
