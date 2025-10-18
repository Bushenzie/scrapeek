import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/schemas/blueprint.ts", "./src/schemas/upvote.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: "esm",
});
