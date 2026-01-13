/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec",
        "primary-light": "#9f4bf6",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "surface-dark": "#231b2e",
      },
      fontFamily: {
        "space-light": ["SpaceGrotesk_300Light"],
        "space-regular": ["SpaceGrotesk_400Regular"],
        "space-medium": ["SpaceGrotesk_500Medium"],
        "space-bold": ["SpaceGrotesk_700Bold"],
      },
    },
  },
  plugins: [],
}
