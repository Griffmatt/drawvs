import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    "bg-black",
    "bg-white",
    "bg-gray-600",
    "bg-gray-400",
    "bg-blue-800",
    "bg-blue-600",
    "bg-green-800",
    "bg-red-800",
    "bg-orange-950",
    "bg-green-600",
    "bg-red-600",
    "bg-orange-500",
    "bg-yellow-600",
    "bg-violet-700",
    "bg-rose-300",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-orange-200",
  ],

  plugins: [],
} satisfies Config;
