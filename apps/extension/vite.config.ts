import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        content: "src/content/index.ts",
        background: "src/background/index.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [tailwindcss()],
});
