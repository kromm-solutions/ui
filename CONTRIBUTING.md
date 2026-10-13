# Contributing to kromm ui

Thanks for helping. This repo is both a registry (distributable components) and a documentation site; the registry side has stricter rules than a typical app because everything under `registry/` and `registry-kromm-ui/` is shipped to consumers through the shadcn CLI.

## Setup

```bash
git clone https://github.com/kromm-solutions/ui
cd ui
pnpm install
pnpm dev
```

Node 22+ and pnpm 10.28.x (CI pins both — see `.github/actions/setup` and `.github/workflows/ci.yml`).

## The quality gates (run these before a PR)

| Command               | What it enforces                                                                |
| --------------------- | ------------------------------------------------------------------------------- |
| `pnpm typecheck`      | `tsc --noEmit` — zero errors                                                    |
| `pnpm check`          | ultracite (Biome) — app code style                                              |
| `pnpm lint:ds:errors` | design-system lint, errors only (`pnpm lint:ds` also shows the warning backlog) |
| `pnpm registry:all`   | metadata → build (24 style dirs + themes + fonts) → `pnpm registry:verify`      |
| `pnpm build`          | full registry pipeline + production site build                                  |

CI runs all of the above on PRs and pushes to `main` and `development`.

## Branching

| Branch                                       | Purpose                                                                     |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| `main`                                       | Stable base. Releases and production deploys (`ui.kromm.io`) cut from here. |
| `development`                                | Default working branch — day-to-day commits and PRs land here.              |
| `feature/*` · `fix/*` · `docs/*` · `chore/*` | Short-lived branches off `development`, merged back by PR.                  |

## Releases

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:` …), which drive versioning:

1. Work merges into `development`; when the base is solid, `development` merges into `main`.
2. [release-please](https://github.com/googleapis/release-please) opens (and keeps updating) a Release PR on `main` with the generated `CHANGELOG.md`.
3. Merging the Release PR tags `vX.Y.Z` and publishes the GitHub Release.
4. Publishing the release triggers `.github/workflows/smoke.yml`: it probes the live registry endpoints in production and installs a component in a throwaway app with the real shadcn CLI — the distribution channel is verified end-to-end on every release.

The component changelog at [ui.kromm.io/docs/changelog](https://ui.kromm.io/docs/changelog) tracks per-component additions in the docs; `CHANGELOG.md` tracks platform releases for developers.

## Registry conventions

### Directory map

- `registry/bases/<base>/ui/` — stock base primitives (`base` = Base UI, `radix` = Radix UI, `aria` = React Aria). Treat as read-mostly: changes cascade to every style.
- `registry-kromm-ui/bases/<base>/kromm-ui/` — components authored by this registry (rich-text-editor, signature-pad, code-block, …) plus each base's `registry.ts` (`export const ui`, `export const hooks`).
- `registry-kromm-ui/bases/shared/` — files shared across bases (e.g. `hooks/`, `ui/`).
- `registry-kromm-ui/bases/<base>/examples/<component>/` — demo files (`c-*.tsx`) with a hand-written `meta.json`. `registry-kromm-ui/_meta/` is regenerated from these by `pnpm registry:metadata`; never edit it by hand.

### Item registration

Items are declared in `registry.ts`, following the `shadcn/schema` `Registry["items"]` type:

- `type`: `registry:ui` | `registry:hook` | `registry:lib` | `registry:block` …
- `files`: repo-relative `path`; `target` only when the consumer layout isn't the type default (`@ui/<name>/…` for multi-file components).
- `dependencies`: hand-declare the obvious ones; `scripts/build-registry.ts` **infers anything missing from the source imports**, and `pnpm registry:verify` fails the build if an import is still undeclared.
- `registryDependencies`: use the bare item name for internal references (`"button"`) — the build rewrites it to `@kromm/button` automatically. Bare names of items we don't ship resolve to the upstream shadcn registry.

### Style variants

Sources may carry per-style Tailwind tokens:

```tsx
"style-vega:rounded-sm style-nova:rounded-md style-luma:rounded-2xl …";
```

Each variant must cover every style in `kromm/registry/resolve-styles.ts`. The build resolves tokens per `{base}-{style}` output directory, and the verifier hard-fails on any unresolved residue.

### Lint rules worth knowing

`pnpm lint:ds` (kromm-lint.config.mjs, `@shadcn/lint`):

- Classes Tailwind cannot generate are errors (typos die here).
- `className` on a registry component must be statically analyzable — no template-literal interpolation; forward `className` props through `cn(...)` with literal strings.
- Examples/blocks may position components but not restyle them (`no-restyle`, `layout` classes allowed).
- Arbitrary values (`w-[290px]`) warn; prefer theme-scale values.

## How AI agents contribute (and how their work is validated)

Agent-assisted PRs are welcome and expected. The rules:

1. Agents should read the machine-readable surfaces before authoring changes: `/llms.txt`, `/.well-known/agent-skills`, and the API catalog.
2. Agent output is held to the same gates as human output: typecheck, `check`, `lint:ds:errors`, `registry:all` must pass in CI. Design-system lint diagnostics embed a pointer to the violated rule so an agent can self-correct.
3. Agent-authored registry items must include `meta.json` guidance (`bestFor`, `whenNotToUse`, `agentNotes`) so future agents choose components correctly.
4. A human reviews visual output before merge — agents assert, humans judge.

## Reporting bugs / requesting features

Use the [issue templates](https://github.com/kromm-solutions/ui/issues/new/choose). Well-scoped, single-component issues are the fastest to land.

## License

By contributing you agree your work is licensed under the project's [MIT license](./LICENSE). Vendored third-party code keeps its own attribution headers — don't strip them.
