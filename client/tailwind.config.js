/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          ss: {
            bg: "#0b1220",
            card: "#0e1729",
            surface: "#111827",
            ink: "#e5e7eb",
            mute: "#9ca3af",
            brand: "#7c3aed",
          },
        },
      },
    },
    darkMode: "class",
    plugins: [],
  };
  