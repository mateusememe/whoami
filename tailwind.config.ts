import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk Variable"', '"Space Grotesk Fallback"', "system-ui", "sans-serif"],
        body: ['"Space Grotesk Variable"', '"Space Grotesk Fallback"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      // Fluid type scale. Each step grows with the viewport between two bounds.
      fontSize: {
        "display-2xl": ["clamp(3.1rem, min(12vw, 16.5svh), 13rem)", { lineHeight: "0.88", letterSpacing: "-0.05em" }],
        "display-xl": ["clamp(2.6rem, 8vw, 8rem)", { lineHeight: "0.94", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(1.9rem, 5.2vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.6rem, 3.4vw, 3.1rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.2rem, 2vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "body-lg": ["clamp(1.0625rem, 1.2vw, 1.25rem)", { lineHeight: "1.6" }],
        label: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.18em" }],
      },
      spacing: {
        gutter: "var(--gutter)",
        section: "var(--section-y)",
      },
      maxWidth: {
        shell: "var(--shell-max)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        signal: {
          DEFAULT: "hsl(var(--signal))",
          foreground: "hsl(var(--signal-foreground))",
        },
      },
      transitionTimingFunction: {
        expo: "var(--ease-expo)",
        quint: "var(--ease-quint)",
        swift: "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "signal-pulse": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--signal) / 0.45)" },
          "70%": { boxShadow: "0 0 0 8px hsl(var(--signal) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--signal) / 0)" },
        },
        "caret-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "scroll-cue": {
          "0%": { transform: "translate3d(0, -100%, 0)" },
          "55%, 100%": { transform: "translate3d(0, 100%, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "signal-pulse": "signal-pulse 2.4s var(--ease-expo) infinite",
        "caret-blink": "caret-blink 1.1s steps(1) infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "scroll-cue": "scroll-cue 2.2s var(--ease-in-out) infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
