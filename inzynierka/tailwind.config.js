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
        'fadeIn': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        scroll: {
          '0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      screens: {
        CustomSM: { max: '850px' },
        CustomXSM: { max: '611px' },
        CustomXXSM: { max: '500px' },
        OverviewTest: { max: '1118px' },
        OverviewTestCol1: { max: '897px' },
        CustomLogin: { max: '700px'},
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none', 
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}
