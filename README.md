<h1 align="center">kromm ui</h1>

<p align="center">
  A development foundation for interfaces: headless UI components, visual adapters, and tooling made for AI agents.
  <br />
  A shadcn-compatible registry: same items, three headless bases, eight visual styles, one install command.
</p>

<p align="center">
  <em>Work in progress — the registry ships installable components today; several capabilities below are in active development and marked as such.</em>
</p>

## What we're building

Three things that today live in different places, in one package:

1. **Headless components.** Every item is authored against three headless bases — [Base UI](https://base-ui.com), [Radix UI](https://www.radix-ui.com) and [React Aria](https://react-spectrum.adobe.com/react-aria) — with the same component names, slot structure and Tailwind classes. You pick the base; the visual contract stays identical.
2. **Visual adapters.** Eight visual styles (vega, nova, maia, lyra, mira, luma, sera, rhea) × twenty-four themes × font packs, resolved **at build time**. Sources can carry per-style Tailwind tokens (`style-luma:rounded-2xl style-sera:rounded-none …`); the registry build compiles them down so consumers receive plain, flat classes — zero variant machinery in your app. *(Style tokens are wired end-to-end; migrating the whole catalog to per-style recipes is in progress.)*
3. **Agent-tooling.** The registry is designed to be consumed by AI agents, not just by them: agent skills under [`/.well-known/agent-skills`](/.well-known/agent-skills), [llms.txt](/llms.txt), an API catalog, a registry source API, and a design-system lint whose diagnostics are written for agents to act on.

## Why not just Radix UI or shadcn/ui?

Radix UI gives you excellent headless primitives — locked to one library, unstyled. shadcn/ui gives you styled copy-paste components — locked to one implementation (its own). kromm ui separates the two axes:

```bash
# Same component, same styles — your choice of headless base:
npx shadcn@latest registry add @kromm-radix=https://ui.kromm.io/r/styles/radix-nova/{name}.json
npx shadcn@latest add @kromm-radix/button

npx shadcn@latest registry add @kromm-base=https://ui.kromm.io/r/styles/base-nova/{name}.json
npx shadcn@latest add @kromm-base/button
```

Structural example of the decoupling: a style-aware source authors its per-style differences inline —

```tsx
radius: {
  default: "style-vega:rounded-sm style-luma:rounded-2xl style-lyra:rounded-none …",
}
```

— and the build resolves each style directory to plain classes (`base-luma` gets `rounded-2xl`, `base-lyra` gets `rounded-none`). A hard `pnpm registry:verify` gate guarantees no unresolved token ever ships. Radix can't give you the styled layer; shadcn/ui can't give you the base axis or per-style compilation. This registry does both, and keeps every artifact machine-readable.

## Install the demo

Three arbitrary items, straight from the live registry — a component, a composite and a hook:

```bash
npx shadcn@latest registry add @kromm=https://ui.kromm.io/r/styles/base-nova/{name}.json

npx shadcn@latest add @kromm/signature-pad   # canvas signature capture
npx shadcn@latest add @kromm/code-block      # shiki code block with copy/collapse
npx shadcn@latest add @kromm/use-file-upload # drag & drop upload state machine
```

Everything on [ui.kromm.io](https://ui.kromm.io) is served as static JSON from a CDN — no serverless registry functions, deployed-artifact caching, and a verification gate that fails the build if an item's imports, metadata or namespaces don't line up.

## Catalog (today)

| Base | What ships |
| ------ | ---------- |
| `base` (Base UI) | badge, button, card, code-block, field, input, kbd, label, native-select, rich-text-editor, separator, signature-pad, skeleton, tabs |
| `radix` (Radix UI) | accordion, alert, aspect-ratio, badge, button, card, collapsible, command, context-menu, dialog, drawer, dropdown-menu, field, input, kbd, label, laptop-mockup, native-select, phone-mockup, popover, rich-text-editor, separator, sheet, sidebar, signature-pad, skeleton, sonner, tabs, text-flip, toggle, tooltip |
| `aria` (React Aria) | badge, button, card, field, input, kbd, label, native-select, rich-text-editor, separator, signature-pad, skeleton |
| hooks (all bases) | use-copy-to-clipboard, use-file-upload, use-scroll-position, use-slider-input |
| themes & fonts | 24 themes (neutral, stone, zinc, mauve, olive, mist, taupe + hue accents), 47 font items (body + heading) |

All of it under every `base`-×-`style` combination in [`/r/styles`](/r/styles/index.json).

## Project structure

```
├── registry/                     # stock base primitives (shadcn-owned surface)
│   └── bases/{aria,base,radix}/  #   registry.ts + ui/
├── registry-kromm-ui/            # kromm's authored layer
│   ├── bases/{aria,base,radix}/
│   │   ├── kromm-ui/             #   custom components + registry.ts (ui, hooks)
│   │   ├── examples/             #   demo examples (site previews)
│   │   └── blocks/|components/   #   larger compositions
│   ├── bases/shared/hooks/       #   hooks shared by all three bases
│   └── _meta/                    #   generated metadata (do not edit by hand)
├── kromm/registry/               # bases / styles / themes / fonts definitions
├── scripts/                      # build-metadata, build-registry, verify-registry
├── kromm-lint.config.mjs         # design-system lint (@shadcn/lint)
├── content/docs/                 # Fumadocs documentation (MDX)
├── app/                          # Next.js site + agent-facing endpoints
└── public/r/                     # built registry JSON (generated)
```

## Scripts

- `pnpm dev` — docs site
- `pnpm registry:metadata` / `pnpm registry:build` / `pnpm registry:verify` / `pnpm registry:all` — registry pipeline
- `pnpm lint:ds` / `pnpm lint:ds:errors` — design-system lint (rules the registry enforces on itself)
- `pnpm check` / `pnpm fix` — ultracite (Biome) for the app
- `pnpm typecheck` — TypeScript check
- `pnpm build` — full registry pipeline + site build

## Maintenance

- **CI:** GitHub Actions runs format/lint (`pnpm check`), design-system lint (`pnpm lint:ds:errors`), the full registry build + verification (`pnpm build`), and typecheck on every PR and push to `main`.
- **Gates:** `pnpm registry:verify` fails on undeclared dependencies, internal-alias leaks, unresolved style tokens, malformed manifests and unnamespaced internal references — with the full defect list, not the first failure.
- **Releases:** documented in the [changelog](https://ui.kromm.io/docs/changelog); items ship per-build with deployment-versioned URLs.
- **Contributing:** see [CONTRIBUTING.md](./CONTRIBUTING.md) — setup, conventions, and how AI agents contribute (and how their output is validated).

## For AI agents

The docs site machine-readable surface is first-class: `llms.txt`, `.well-known/agent-skills`, an OpenAPI document, an API catalog and a registry source endpoint. Design-system lint diagnostics carry a pointer to the rules an agent violated, so agent-authored patches can self-correct inside CI.

## Status & adoption

Public and MIT-licensed since day one; the catalog is installable and the pipeline is green. Adoption numbers are intentionally absent here — we'd rather report them when they're real. Feedback, issues and PRs are the current growth channel: [open an issue](https://github.com/kromm-solutions/ui/issues/new/choose).

## License

[MIT](./LICENSE)

---

Bootstrapped from [`shadcn-labs/startercn`](https://github.com/shadcn-labs/startercn). Some registry infrastructure ideas (multi-style compilation, verification gates, CDN-served artifacts) are vendored under MIT from [`keenthemes/reui`](https://github.com/keenthemes/reui).
