/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#3b82f6',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#0f172a',
        card: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        button: '6px'
      },
      height: {
        button: '36px'
      }
    }
  },
  plugins: []
}
