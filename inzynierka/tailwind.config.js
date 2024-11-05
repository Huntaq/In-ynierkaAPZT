/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'progress-gradient': 'repeating-linear-gradient(30deg, #5ca86e 0, #5ca86e 10px, #409A55 10px, #409A55 20px)',
      },
      animation: {
        'scrolling-progress': 'scroll 5s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      screens: {
        CustomSM: { max: '750px' },
      },
    },
  },
  plugins: [],
}

