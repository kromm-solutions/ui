// Vendored from https://github.com/keenthemes/reui (MIT License)
// Copyright (c) 2025 Keenthemes Inc
// Adapted: component roots and file scopes point at this repo's tree.

/**
 * kromm-lint.shared.mjs
 *
 * SOURCE OF TRUTH for the kromm-ui design-system lint rules (@shadcn/lint).
 *
 * The same rule vocabulary governs the authoring surfaces:
 *   - primitives  registry/bases/<base>/ui                    (stock bases)
 *   - customs     registry-kromm-ui/bases/<base>/kromm-ui     (kromm primitives)
 *   - examples    registry-kromm-ui/bases/<base>/examples
 *   - blocks      registry-kromm-ui/bases/<base>/(blocks|components)
 *
 * kromm-lint.config.mjs imports this and adds only what is genuinely local:
 * which paths it authors, and which non-Tailwind classes are legitimate there.
 * Severity overrides are allowed but must carry a reason.
 *
 * SEVERITY PRINCIPLE
 * A rule errors where the tree is already clean, and warns while a real backlog
 * is being drained. Severity tracks the backlog, never the rule's importance.
 * no-restyle is the most important rule for a consumer surface and is still a
 * warning, because the backlog is large.
 */

/**
 * Where a "component" comes from. components.json aliases ui to
 * @/components/ui, which holds no primitives, so the real roots are named.
 */
export const COMPONENT_IMPORTS = [
  "@/registry/bases/aria/ui",
  "@/registry/bases/base/ui",
  "@/registry/bases/radix/ui",
  "@/registry-kromm-ui/bases/aria/kromm-ui",
  "@/registry-kromm-ui/bases/base/kromm-ui",
  "@/registry-kromm-ui/bases/radix/kromm-ui",
];

/**
 * Shared recognition settings. `note` is appended to every diagnostic: this
 * linter is agent-first, so each message ends by pointing the agent at the rules
 * it was already meant to follow. Each repo passes its own note.
 */
export function sharedSettings(note) {
  return { componentImports: COMPONENT_IMPORTS, note };
}

/**
 * The rule vocabulary and its baseline severities.
 *
 * @param {object} options
 * @param {string[]} options.allowUnknown  Non-Tailwind classes that are legitimate
 *   in this repo (reserved prefixes, third-party stylesheet classes, classes a
 *   file declares in its own CSS). Everything else Tailwind cannot generate is an
 *   error, which is what catches a real typo such as `gap-0/5` or `tru`.
 * @param {Record<string, unknown>} [options.overrides]  Per-repo severity changes.
 *   Every entry needs a comment at the call site saying why.
 */
export function designSystemRules({ allowUnknown = [], overrides = {} } = {}) {
  return {
    // Catches classes Tailwind cannot generate: typos, and dead classes that
    // silently style nothing. Errors from day one wherever the tree is clean.
    "shadcn/no-unknown-classes": ["error", { allow: allowUnknown }],

    // A dynamically built className cannot be linted at all.
    "shadcn/require-static-classes": "error",

    // Component ownership. A consumer overriding a primitive's own spacing,
    // colour, shape, typography, effects or motion is the "Defaults over custom"
    // defect. `layout` stays allowed: placement is the caller's job.
    "shadcn/no-restyle": ["warn", { allow: ["layout"] }],

    // Keeps values on the theme scale ("w-60", not "w-[200px]"). Variant
    // selectors such as data-[state=open] are not flagged.
    "shadcn/no-arbitrary-values": "warn",

    // Recognition settings do not apply to this rule by design, so it takes no
    // component options.
    "shadcn/no-inline-styles": "warn",

    // DESIGN DECISION: raw Tailwind palette classes are deliberate across the
    // registry. They carry categorical identity and are hand-paired light and
    // dark, because --chart-N flips hue between themes so identity has no
    // stable token. This rule stays off. Do not scope it back on.
    "shadcn/no-raw-colors": "off",

    ...overrides,
  };
}

/**
 * Registry source may carry eslint-disable comments for the APP lint gate's
 * rules. Those plugins are not loaded in a design-system run, and an
 * unresolvable directive is a hard error. Ignoring inline config drops them.
 * The trade is deliberate: a design-system rule cannot be silenced file-locally,
 * only in the config.
 */
export const LINTER_OPTIONS = {
  noInlineConfig: true,
  reportUnusedDisableDirectives: "off",
};

/**
 * Classes a file declares in its own CSS, rendered through a <style> element.
 *
 * Ambient animation is authored as a CSS string (`.hero9-blink {...}`,
 * `@keyframes ...`). The linter cannot see those declarations, so each one reads
 * as a class Tailwind cannot generate. Deriving the list from source instead of
 * freezing one keeps no-unknown-classes honest: a genuinely misspelled Tailwind
 * class is still an error, and a file that adds a new local animation never has
 * to touch a config.
 *
 * Both string forms are read. Most files hold their CSS in a backtick literal,
 * but some build it from long double-quoted strings, and gating on the presence
 * of "<style" misses files that render the literal some other way. The CSS test
 * stays loose (a brace with a colon, or @keyframes) because a rule body such as
 * "{ --x: 0.82 }" carries no semicolon.
 *
 * Use it only where local CSS is an established pattern. Do NOT reach for it to
 * silence findings on a surface that has none: those findings are real typos,
 * and an allowlist would mask them.
 */
const CSS_LITERAL = /`[^`]*`|"(?:[^"\\\n]|\\.){12,}"/g;
const CSS_SELECTOR = /(?:^|[\s,>+~])\.(-?[A-Za-z_][\w-]*)(?![\w-]*\()/g;

export function localCssClasses(roots, { readdirSync, readFileSync, join }) {
  const found = new Set();
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".tsx")) continue;
      const source = readFileSync(full, "utf8");
      // Only look inside literals that actually read as CSS, so a JS member
      // expression (.length, .current) is never mistaken for a selector.
      for (const literal of source.match(CSS_LITERAL) ?? []) {
        if (!/@keyframes|\{[^}]*:/.test(literal)) continue;
        for (const m of literal.matchAll(CSS_SELECTOR)) found.add(m[1]);
      }
    }
  };
  roots.forEach(walk);
  return [...found].sort();
}
