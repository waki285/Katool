// @ts-check
import { context } from "esbuild";

/** @type {import("esbuild").BuildOptions} */
const SharedConfig = {
  format: "esm",
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
  platform: "browser",
});
const ctx2 = await context({
  ...SharedConfig,
  entryPoints: ["src/register.ts"],
  outfile: "dist/register.js",
  platform: "node",
  packages: "external",
});

await Promise.all([ctx, ctx2].map((c) => c.rebuild()));
process.exit(0);
