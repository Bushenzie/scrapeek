import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/schemas/blueprint.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: "esm",
});
