/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        light: "rgb(214, 214, 214)",
        rojo: "red",
        btn_toggle_dark: "#1a1a1a",
        btn_toggle: "#d4d4d492"
      },
    },
  },
  darkMode: ["class", '[data-mode="dark"]'],
  plugins: [],
}
