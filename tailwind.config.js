/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "border-error",
    "border-primary",
    "border-secondary",
    "border-success",
    "border-accent",
    "badge-error",
    "badge-primary",
    "badge-secondary",
    "badge-success",
    "badge-accent",
    "text-ellipsis",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["synthwave"],
  },
};
