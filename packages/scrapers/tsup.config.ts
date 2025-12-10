import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/core/legacy/static.ts",
    "./src/core/legacy/dynamic.ts",
    "./src/core/legacy/api.ts",
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: "esm",
});
