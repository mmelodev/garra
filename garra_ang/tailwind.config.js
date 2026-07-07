/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          900: 'var(--color-primary-900)',
        },
        accent: {
          100: 'var(--color-accent-100)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
        },
        positive: {
          50: 'var(--color-positive-50)',
          600: 'var(--color-positive-600)',
        },
        negative: {
          50: 'var(--color-negative-50)',
          600: 'var(--color-negative-600)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        ink: {
          DEFAULT: 'var(--color-action-solid)',
          hover: 'var(--color-action-solid-hover)',
        },
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.3s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      fontFamily: {
        base: 'var(--font-family-base)',
      },
      fontSize: {
        display: 'var(--font-size-display)',
        heading: 'var(--font-size-heading)',
        body: 'var(--font-size-body)',
        caption: 'var(--font-size-caption)',
      },
    },
  },
  plugins: [],
}
