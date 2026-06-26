import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg0)",
          1: "var(--bg1)",
          2: "var(--bg2)",
          3: "var(--bg3)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          dim:    "var(--teal-dim)",
          ghost:  "var(--teal-ghost)",
          ghost2: "var(--teal-ghost2)",
        },
        red:   { DEFAULT: "var(--red)" },
        amber: { DEFAULT: "var(--amber)" },
        green: { DEFAULT: "var(--green)" },
        ink: {
          0: "var(--text0)",
          1: "var(--text1)",
          2: "var(--text2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
    },
  },
  plugins: [],
};
export default config;
