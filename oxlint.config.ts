import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, next, vitest],
  ignorePatterns: [
    "public/r/**",
    "registry-kromm-ui/_meta/**",
    ".agents/**",
    ".cursor/**",
    ".changeset/**",
    ".claude/**",
    ".web-kits/**",
    "audio/**",
  ],
  rules: {
    // This codebase vendors and extends shadcn/ui, whose idiom is function
    // declarations with hoisted helpers and nested ternaries for conditional
    // classnames. Rules that fight that idiom stay off — everything that
    // catches real defects stays on.
    "func-style": "off",
    "no-use-before-define": "off",
    "sort-keys": "off",
    "no-inline-comments": "off",
    "prefer-destructuring": "off",
    "no-negated-condition": "off",
    "no-nested-ternary": "off",
    "no-plusplus": "off",
    "no-lonely-if": "off",
    "no-shadow": "off",
    "promise/prefer-await-to-then": "off",
    "promise/prefer-catch": "off",
    "promise/prefer-await-to-callbacks": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-modern-math-apis": "off",
    "unicorn/prefer-number-properties": "off",
    "unicorn/no-useless-collection-argument": "off",
    "unicorn/no-lonely-if": "off",
    "unicorn/prefer-module": "off",
    "node/global-require": "off",
    // Rewriting fileURLToPath(import.meta.url) to import.meta.dirname breaks
    // modules that Next.js bundles for the browser (import.meta.dirname is
    // undefined there) — e.g. kromm/read-file.ts via registry/selectors.ts.
    "unicorn/prefer-import-meta-properties": "off",
    // False positives against the named-default export shapes common in
    // registry code.
    "import/no-named-as-default": "off",
  },
  overrides: [
    {
      files: ["scripts/**"],
      rules: {
        // Fail-fast CLI scripts: non-null assertions are acceptable, and the
        // verify pipeline is a long procedural checklist by design.
        "no-non-null-assertion": "off",
        complexity: "off",
      },
    },
  ],
});
