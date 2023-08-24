// @ts-check
import { context } from "esbuild";

/** @type {import("esbuild").BuildOptions} */
const SharedConfig = {
  format: "esm",
  platform: "browser",
  bundle: true,
  minify: true,
  sourcemap: false,
  legalComments: "none",
  target: "esnext",
  logLevel: "info",
  tsconfig: "tsconfig.json",
  allowOverwrite: true,
};

const ctx = await context({
  ...SharedConfig,
  entryPoints: ["src/server.ts"],
  outfile: "dist/server.js",
});

await ctx.rebuild();
process.exit(0);
