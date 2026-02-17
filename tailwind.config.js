/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 使用 class 切換深色模式
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mayday: {
          blue: '#0096FF', // SPEC 主色
        },
      },
    },
  },
  plugins: [],
}