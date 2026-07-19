/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#06070d", // near-black deep navy
          900: "#0b0e1a",
          800: "#12162a",
          700: "#1a2038",
        },
        violet: {
          glow: "#8b7dff",
        },
        teal: {
          glow: "#3ee0c8",
        },
        mood: {
          green: "#4ade80",
          blue: "#60a5fa",
          amber: "#fbbf24",
          coral: "#fb7185",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      boxShadow: {
        glowViolet: "0 0 24px 2px rgba(139, 125, 255, 0.45)",
        glowTeal: "0 0 24px 2px rgba(62, 224, 200, 0.4)",
        glowSoft: "0 0 40px 6px rgba(139, 125, 255, 0.18)",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #8b7dff 0%, #4f8dff 100%)",
        "grad-teal": "linear-gradient(135deg, #3ee0c8 0%, #4ade80 100%)",
        "grad-radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(139,125,255,0.16), transparent 60%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        meteor: {
          "0%": { transform: "translateY(0) translateX(0) rotate(215deg)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(300px) translateX(-300px) rotate(215deg)", opacity: "0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        meteor: "meteor 6s linear infinite",
        floatSlow: "floatSlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
