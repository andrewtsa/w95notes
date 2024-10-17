import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'win95': {
          'bg': '#008080',
          'gray': {
            100: '#ffffff',
            200: '#dfdfdf',
            300: '#c0c0c0',
            400: '#808080',
            500: '#000000',
          },
          'blue': {
            300: '#000080',
            400: '#1084d0',
          },
          'red': '#ff0000',
          'green': '#00ff00',
          'yellow': '#ffff00',
        },
        'pink': {
          300: '#FFC0CB',
        },
      },
      fontFamily: {
        'sans': ['MS Sans Serif', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'win95-btn': 'inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff',
        'win95-btn-pressed': 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey',
        'win95-container': 'inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities = {
        '.border-win95': {
          'border-style': 'solid',
          'border-width': '5px',
          'border-bottom-color': '#535353',
          'border-right-color': '#535353',
          'border-top-color': '#fff',
          'border-left-color': '#fff',
        },
        '.border-win95-inset': {
          'border-style': 'solid',
          'border-width': '2px',
          'border-bottom-color': '#fff',
          'border-right-color': '#fff',
          'border-top-color': '#535353',
          'border-left-color': '#535353',
        },
      }
      addUtilities(newUtilities)
    }),
  ],
}

export default config
