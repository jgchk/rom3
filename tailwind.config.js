const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const typography = require('@tailwindcss/typography')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        mackinac: ['P22 Mackinac', 'serif'],
      },
      backgroundImage: {
        check: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`,
        'arrow-down': `url("data:image/svg+xml,%3Csvg stroke='none' fill='%23a8a29e' stroke-width='0' viewBox='0 0 24 24' class='pointer-events-none' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [typography],
}
