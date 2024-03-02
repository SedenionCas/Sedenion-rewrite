/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: {
        DEFAULT: "var(--primary)",
        on: "var(--on-primary)",
        container: "var(--primary-container)",
        "on-container": "var(--on-primary-container)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        on: "var(--on-secondary)",
        container: "var(--secondary-container)",
        "on-container": "var(--on-secondary-container)",
      },
      tertiary: {
        DEFAULT: "var(--tertiary)",
        on: "var(--on-tertiary)",
        container: "var(--tertiary-container)",
        "on-container": "var(--on-tertiary-container)",
      },
      error: {
        DEFAULT: "var(--error)",
        on: "var(--on-error)",
        container: "var(--error-container)",
        "on-container": "var(--on-error-container)",
      },
      background: {
        DEFAULT: "var(--background)",
        on: "var(--on-background)",
      },
      surface: {
        DEFAULT: "var(--surface)",
        on: "var(--on-surface)",
        variant: "var(--surface-variant)",
        "on-variant": "var(--on-surface-variant)",
      },
      outline: "var(--outline)",
    },
  },
  plugins: [],
};
