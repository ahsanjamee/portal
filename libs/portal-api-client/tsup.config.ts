import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "./dist",
  clean: true,
  format: ["esm"],
  external: ["react", "react-dom", "axios"],
  cjsInterop: true,
  dts: true,
  bundle: true,
});
