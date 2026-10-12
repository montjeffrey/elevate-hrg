import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

// eslint-config-next sets `react.version: "detect"`, which makes
// eslint-plugin-react probe the filesystem through `context.getFilename()` —
// an API ESLint 10 removed, so detection throws on load. Resolving the version
// ourselves skips that code path entirely. Read from the installed React
// rather than hardcoded, so it stays correct as React is upgraded.
const reactVersion = createRequire(import.meta.url)(
  "react/package.json",
).version;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  { settings: { react: { version: reactVersion } } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
