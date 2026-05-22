/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090b10",
        panel: "#0f1218",
        line: "#1f2430",
        text: "#e8ecf3",
        muted: "#a2adbf",
        accent: "#cfd8e7"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(0,0,0,0.35)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};
