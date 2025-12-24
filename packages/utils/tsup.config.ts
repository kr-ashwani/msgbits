import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2022",
  platform: "node",

  // Output
  outDir: "dist",
  clean: true,

  // Source maps for debugging
  sourcemap: true,

  // Split code for better caching
  splitting: false,

  // Type declarations
  dts: true,

  // Tree shaking
  treeshake: true,

  // Minify in production
  minify: process.env.NODE_ENV === "production",

  // 🔥 THIS IS THE IMPORTANT PART
  noExternal: ["lodash"],

  // Skip node_modules
  skipNodeModulesBundle: true,

  // Environment
  env: {
    NODE_ENV: process.env.NODE_ENV || "development",
  },
});
