// Vendored from https://github.com/keenthemes/reui (MIT License)
// Copyright (c) 2025 Keenthemes Inc
// Adapted: PRIMITIVES/EXAMPLES scopes and component roots for the kromm-ui tree.

import { plugin as shadcn } from "@shadcn/lint";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

import {
  LINTER_OPTIONS,
  designSystemRules,
  sharedSettings,
} from "./kromm-lint.shared.mjs";

// Design-system lint for registry source. Run with `pnpm lint:ds`.
// Kept out of the app lint gate (ultracite/oxlint) on purpose: this config
// governs registry source only, and its severities ratchet independently of
// the app.
//
// The rule vocabulary lives in kromm-lint.shared.mjs, the source of truth for
// every authoring surface. This file adds only what is local to this repo:
// which paths it authors, and which non-Tailwind classes are real here. Change
// a rule in the shared file, not here.

const settings = sharedSettings(
  "Design system rules: https://ui.kromm.io/docs. Raw Tailwind palette classes are a deliberate kromm-ui decision, not a defect."
);

// Not Tailwind utilities, so no-unknown-classes must not judge them.
// This list stays SHORT on purpose.
const RESERVED = [
  // Per-style variant prefixes, declared @custom-variant in styles/globals.css.
  "style-*",
  // sonner ships its own stylesheet and targets this class (ui/sonner.tsx).
  "toaster",
];

// registry/bases/*/ui are the stock base primitives; registry-kromm-ui holds
// the kromm primitives, examples and blocks. Lint all authoring surfaces.
const PRIMITIVES = [
  "registry/bases/*/ui/**/*.tsx",
  "registry-kromm-ui/bases/*/kromm-ui/**/*.tsx",
];
const EXAMPLES = [
  "registry-kromm-ui/bases/*/examples/**/*.tsx",
  "registry-kromm-ui/bases/*/blocks/**/*.tsx",
  "registry-kromm-ui/bases/*/components/**/*.tsx",
];

export default defineConfig([
  {
    files: [...PRIMITIVES, ...EXAMPLES],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    linterOptions: LINTER_OPTIONS,
    plugins: { shadcn },
    rules: designSystemRules({
      allowUnknown: RESERVED,
      overrides: {
        // no-restyle is scoped per surface below, so it is off at this level.
        "shadcn/no-restyle": "off",
      },
    }),
    settings: { shadcn: settings },
  },

  // Examples/blocks CONSUME the design system, so component ownership applies.
  {
    files: EXAMPLES,
    rules: {
      "shadcn/no-restyle": ["warn", { allow: ["layout"] }],
    },
  },

  // Primitives DEFINE the design system. A primitive composing another
  // primitive is a deliberate internal decision, not a consumer restyling a
  // black box. Arbitrary values and inline styles here are system authoring
  // (ring-[3px], calc, cubic-bezier) and computed layout.
  {
    files: PRIMITIVES,
    rules: {
      "shadcn/no-arbitrary-values": "off",
      "shadcn/no-inline-styles": "off",
      "shadcn/no-restyle": "off",
    },
  },
]);
