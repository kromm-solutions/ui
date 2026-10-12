import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createJiti } from "jiti";
import { z } from "zod";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_DIR = path.join(ROOT, "registry-kromm-ui");
const META_OUT = path.join(REGISTRY_DIR, "_meta");
const EXAMPLES_ROOT = path.join(REGISTRY_DIR, "bases");
const PUBLIC_R = path.join(ROOT, "public", "r");

const jiti = createJiti(import.meta.url, {
  alias: {
    "@": ROOT,
  },
  jsx: true,
});

const { STYLES } = jiti("@/kromm/registry") as {
  STYLES: { name: string }[];
};

const EXAMPLE_META_SCHEMA = z.array(
  z.object({
    description: z.string(),
    name: z.string(),
    order: z.number(),
    title: z.string(),
  })
);

// ---------------------------------------------------------------------------
// Error collection. Source-inconsistency checks fail fast (exit on first
// error, as before); shipped-JSON gates collect every error so a single run
// reports the full defect list.
// ---------------------------------------------------------------------------
const collectedErrors: string[] = [];
const collectedWarnings: string[] = [];

async function fail(msg: string) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function collectError(msg: string) {
  collectedErrors.push(msg);
}

function collectWarning(msg: string) {
  collectedWarnings.push(msg);
}

async function flushCollected() {
  for (const warning of collectedWarnings) {
    console.warn(`⚠️  ${warning}`);
  }
  if (collectedErrors.length > 0) {
    console.error(`❌ ${collectedErrors.length} problema(s) en el registry emitido:`);
    for (const error of collectedErrors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 1. Consistency between meta.json, source files and _meta shards (existing).
// ---------------------------------------------------------------------------
async function checkMetaConsistency() {
  const bases = await fs.readdir(EXAMPLES_ROOT, { withFileTypes: true });
  for (const b of bases) {
    if (!b.isDirectory()) {
      continue;
    }
    if (b.name === "shared" || b.name === "__generated__") {
      continue;
    }
    const examplesRoot = path.join(EXAMPLES_ROOT, b.name, "examples");
    try {
      const comps = await fs.readdir(examplesRoot, { withFileTypes: true });
      for (const c of comps) {
        if (!c.isDirectory()) {
          continue;
        }
        const metaPath = path.join(examplesRoot, c.name, "meta.json");
        const raw = await fs.readFile(metaPath, "utf-8");
        const entries = EXAMPLE_META_SCHEMA.parse(JSON.parse(raw));
        for (const e of entries) {
          const file = path.join(examplesRoot, c.name, `${e.name}.tsx`);
          try {
            await fs.access(file);
          } catch {
            await fail(`Falta archivo ${e.name}.tsx en ${c.name}/${b.name}`);
          }
        }
        // check _meta exists
        const metaOutFile = path.join(
          META_OUT,
          "components",
          "bases",
          b.name,
          `${c.name}.json`
        );
        try {
          await fs.access(metaOutFile);
        } catch {
          await fail(`_meta faltante ${metaOutFile}`);
        }
      }
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// 2. MDX docs reference examples/, not meta/ (existing).
// ---------------------------------------------------------------------------
async function checkMdxImports() {
  const contentRoot = path.join(ROOT, "content", "docs", "components");
  const bases = ["base", "aria", "radix"];
  for (const base of bases) {
    const mdxPath = path.join(contentRoot, base, "signature-pad.mdx");
    try {
      const txt = await fs.readFile(mdxPath, "utf-8");
      if (txt.includes("registry-kromm-ui/meta")) {
        await fail(`MDX ${base} aun referencia meta/`);
      }
      if (
        !txt.includes(`registry-kromm-ui/bases/${base}/examples/signature-pad`)
      ) {
        await fail(`MDX ${base} no usa examples/`);
      }
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// 3. Examples must not import the documentation site's components (existing).
// ---------------------------------------------------------------------------
async function checkNoSiteImports() {
  const bases = await fs.readdir(EXAMPLES_ROOT, { withFileTypes: true });
  for (const b of bases) {
    if (!b.isDirectory()) {
      continue;
    }
    if (b.name === "shared" || b.name === "__generated__") {
      continue;
    }
    const examplesRoot = path.join(EXAMPLES_ROOT, b.name, "examples");
    const comps = await fs.readdir(examplesRoot, { withFileTypes: true });
    for (const c of comps) {
      if (!c.isDirectory()) {
        continue;
      }
      const files = await fs.readdir(path.join(examplesRoot, c.name));
      for (const f of files) {
        if (!f.endsWith(".tsx")) {
          continue;
        }
        const content = await fs.readFile(
          path.join(examplesRoot, c.name, f),
          "utf-8"
        );
        // A demo snippet shown by an example lives inside a template literal and
        // is content, not an import. Drop literals first so only real module
        // specifiers are reported as a leak.
        const source = content.replaceAll(/`[\s\S]*?`/g, "");
        if (/from\s+["']@\/components\/ui\//.test(source)) {
          await fail(
            `Ejemplo ${c.name} usa import de @/components/ui (leak) en ${f}`
          );
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Shipped-JSON production gates (vendored from reui.io's verify-registry).
// ---------------------------------------------------------------------------

// Packages every registry consumer already has from the shadcn scaffold; they
// legitimately appear as imports without an item-level declaration.
const SCAFFOLD_PACKAGES = new Set([
  "react",
  "react-dom",
  "next",
  "@types/react",
  "@types/react-dom",
]);

// Item types that must always carry files with content. Themes/fonts/styles
// are cssVars/dependency-only items and have no files.
const FILE_CARRYING_TYPES = new Set([
  "registry:ui",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:component",
]);

// Source aliases that must never leak into shipped content. NOTE:
// "@/registry/bases/<base>/ui/..." imports are intentional in this pipeline —
// the CLI rewrites them against the consumer's aliases at install time.
const LEAK_PATTERNS: { pattern: RegExp; label: string }[] = [
  { label: "@/registry-kromm-ui/", pattern: /@\/registry-kromm-ui\// },
  { label: "@/kromm/", pattern: /@\/kromm\// },
];

const STYLE_VARIANT_LEAK_RE = new RegExp(
  `\\bstyle-(?:${STYLES.map((s) => s.name).join("|")}):[^\\s"'\`]`,
  ""
);

const IMPORT_PATTERNS = [
  /from\s+["']([^"']+)["']/g,
  /import\s+["']([^"']+)["']/g,
  /import\(\s*["']([^"']+)["']\s*\)/g,
  /require\(\s*["']([^"']+)["']\s*\)/g,
];

// Replace template-literal bodies (keeping backticks and newlines) so that
// source code taught inside a template string is not mistaken for a real
// import statement.
function stripTemplateLiteralContent(code: string): string {
  return code.replace(/`(?:\\[\s\S]|\${[^`]*}*|[^\\`])*`/g, (literal) =>
    `\`${literal
      .slice(1, -1)
      .replace(/\{\{[^}]*\}\}/g, " ")
      .replace(/[^{}\n]/g, " ")}\``
  );
}

function packageNameFromImport(spec: string): string | null {
  if (/[\s$(){}`]/.test(spec)) {
    return null; // comment / false positive guard
  }
  if (spec.startsWith(".") || spec.startsWith("@/") || spec.startsWith("/")) {
    return null; // relative or consumer-alias import
  }
  if (spec.startsWith("node:")) {
    return null;
  }
  const parts = spec.split("/");
  return spec.startsWith("@") ? `${parts[0]}/${parts[1]}` : (parts[0] ?? null);
}

function collectImportedPackages(content: string): string[] {
  const source = stripTemplateLiteralContent(content);
  const packages = new Set<string>();
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      const name = packageNameFromImport(match[1]);
      if (name) {
        packages.add(name);
      }
    }
  }
  return [...packages];
}

const ITEM_TYPES = z.enum([
  "registry:ui",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:component",
  "registry:theme",
  "registry:font",
  "registry:style",
  "registry:base",
]);

async function readJson(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf-8"));
  } catch (error) {
    collectError(`JSON inválido: ${path.relative(ROOT, file)} (${error})`);
    return null;
  }
}

async function checkDependencyCompleteness(
  itemLabel: string,
  item: Record<string, unknown>,
  declaredKinds: Set<string>
) {
  const imported = new Set<string>();
  for (const file of (item.files as { content?: string }[]) ?? []) {
    if (typeof file.content !== "string") {
      continue;
    }
    for (const name of collectImportedPackages(file.content)) {
      imported.add(name);
    }
  }
  // Completeness is measured against the item's own dependencies array — that
  // is what the CLI installs. Repo-level package.json presence is irrelevant.
  const declared = new Set(
    ((item.dependencies as string[]) ?? []).map((dep) =>
      packageNameFromImport(dep.replace(/@[\w.~^>=-]+$/, "")) ?? dep
    )
  );
  const missing = [...imported].filter(
    (name) => !declared.has(name) && !SCAFFOLD_PACKAGES.has(name)
  );
  if (missing.length > 0) {
    collectError(
      `${itemLabel}: imports sin declarar en dependencies: ${missing.join(", ")}`
    );
  }
  // Every declared package must resolve to a version the repo can ship. A
  // dependency missing from the root package.json would install unpinned.
  for (const dep of declared) {
    if (!declaredKinds.has(dep)) {
      collectError(
        `${itemLabel}: declared dependency "${dep}" ausente en package.json (sin versión resoluble)`
      );
    }
  }
}

async function checkItemLeaks(itemLabel: string, item: Record<string, unknown>) {
  for (const file of (item.files as { path?: string; content?: string }[]) ?? []) {
    if (typeof file.content !== "string") {
      continue;
    }
    const label = `${itemLabel} (${file.path ?? "?"})`;
    for (const { label: leakName, pattern } of LEAK_PATTERNS) {
      if (pattern.test(file.content)) {
        collectError(`${label}: leak de alias interno ${leakName}`);
      }
    }
    if (STYLE_VARIANT_LEAK_RE.test(file.content)) {
      collectError(
        `${label}: tokens style-*: sin resolver en el contenido emitido`
      );
    }
    for (const line of file.content.split("\n")) {
      // SVG path data is the only legitimate ultra-long line.
      if (line.length > 2000 && !line.includes("<path")) {
        collectError(`${label}: línea de ${line.length} chars (posible minificación accidental)`);
      }
    }
  }
}

async function checkBuiltRegistry() {
  const pkg = JSON.parse(await fs.readFile(path.join(ROOT, "package.json"), "utf-8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  const knownPackages = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  const stylesDir = path.join(PUBLIC_R, "styles");
  const entries = await fs.readdir(stylesDir, { withFileTypes: true });
  const namesPerBase = new Map<string, string[]>();
  // Deferred: bare registryDependencies are validated once the full set of
  // shipped item names is known (any of our own items must be referenced
  // through the @kromm/ namespace, never bare, or consumers resolve them
  // against the upstream shadcn registry).
  const pendingRegistryDepChecks: { deps: string[]; label: string }[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name === "index.json") {
      const index = await readJson(path.join(stylesDir, entry.name));
      if (!Array.isArray(index)) {
        collectError("public/r/styles/index.json debe ser un array de estilos");
        continue;
      }
    }
    if (!entry.isDirectory()) {
      continue;
    }

    const styleSlug = entry.name;
    const dirFiles = await fs.readdir(path.join(stylesDir, styleSlug));
    const itemNames: string[] = [];

    for (const file of dirFiles) {
      if (!file.endsWith(".json")) {
        continue;
      }
      const filePath = path.join(stylesDir, styleSlug, file);
      const json = await readJson(filePath);
      if (!json) {
        continue;
      }

      if (file === "registry.json") {
        // Per-style catalog manifest written by `shadcn build`.
        if (typeof json.name !== "string" || !Array.isArray(json.items)) {
          collectError(`${styleSlug}/registry.json: manifiesto malformado`);
        }
        continue;
      }

      const label = `${styleSlug}/${file}`;
      const parsedType = ITEM_TYPES.safeParse(json.type);
      if (typeof json.name !== "string" || !parsedType.success) {
        collectError(`${label}: faltan name/type válidos`);
        continue;
      }
      itemNames.push(json.name);

      for (const depKind of ["dependencies", "registryDependencies"] as const) {
        const deps = json[depKind];
        if (deps === undefined) {
          continue;
        }
        if (
          !Array.isArray(deps) ||
          deps.some((dep) => typeof dep !== "string" || dep.length === 0)
        ) {
          collectError(`${label}: ${depKind} debe ser un array de strings no vacíos`);
        } else if (depKind === "registryDependencies") {
          pendingRegistryDepChecks.push({ deps: deps as string[], label });
        }
      }

      if (FILE_CARRYING_TYPES.has(parsedType.data as string)) {
        const files = json.files;
        if (!Array.isArray(files) || files.length === 0) {
          collectError(`${label}: sin files[]`);
          continue;
        }
        for (const f of files as { path?: string; content?: string }[]) {
          if (typeof f.path !== "string" || f.path.length === 0) {
            collectError(`${label}: file sin path`);
          }
          if (typeof f.content !== "string" || f.content.length === 0) {
            collectError(`${label} (${f.path ?? "?"}): contenido vacío`);
          }
        }
      }

      await checkDependencyCompleteness(label, json, knownPackages);
      await checkItemLeaks(label, json);
    }

    const baseName = styleSlug.split("-")[0];
    namesPerBase.set(
      baseName,
      [...new Set([...(namesPerBase.get(baseName) ?? []), ...itemNames])] as string[]
    );
  }

  // Any bare registryDependency naming one of our own shipped items must go
  // through the @kromm/ namespace.
  const allKnownNames = new Set(
    [...namesPerBase.values()].flat()
  );
  for (const { deps, label } of pendingRegistryDepChecks) {
    for (const dep of deps) {
      if (!dep.includes("/") && !dep.includes(":") && allKnownNames.has(dep)) {
        collectError(
          `${label}: registryDependencies "${dep}" bare — debe ser "@kromm/${dep}" (si no, el consumidor lo resuelve contra shadcn upstream)`
        );
      }
    }
  }

  // Cross-base coverage parity is a warning, not an error: bases legitimately
  // differ in coverage, but a divergence this visible deserves a human look.
  const sorted = [...namesPerBase.keys()].sort();
  for (let i = 1; i < sorted.length; i++) {
    const a = namesPerBase.get(sorted[0]) ?? [];
    const b = namesPerBase.get(sorted[i]) ?? [];
    const onlyA = a.filter((n) => !b.includes(n));
    const onlyB = b.filter((n) => !a.includes(n));
    if (onlyA.length || onlyB.length) {
      collectWarning(
        `Paridad de items entre bases (${sorted[0]!}: ${a.length}, ${sorted[i]!}: ${b.length}) diverge: solo ${sorted[0]!}=[${onlyA.join(", ")}], solo ${sorted[i]!}=[${onlyB.join(", ")}]`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Same gates for themes and fonts outputs (schema-level only).
// ---------------------------------------------------------------------------
async function checkThemeAndFontDirs() {
  for (const dirName of ["themes", "fonts"]) {
    const dirPath = path.join(PUBLIC_R, dirName);
    let files: string[];
    try {
      files = await fs.readdir(dirPath);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith(".json")) {
        continue;
      }
      const filePath = path.join(dirPath, file);
      const json = await readJson(filePath);
      if (!json) {
        continue;
      }
      if (file === "registry.json") {
        if (typeof json.name !== "string" || !Array.isArray(json.items)) {
          collectError(`${dirName}/registry.json: manifiesto malformado`);
        }
        continue;
      }
      if (typeof json.name !== "string") {
        collectError(`${dirName}/${file}: falta name`);
      }
    }
  }
}

(async () => {
  await checkMetaConsistency();
  await checkMdxImports();
  await checkNoSiteImports();
  await checkBuiltRegistry();
  await checkThemeAndFontDirs();
  await flushCollected();
  console.log("✅ Verificación de registry completada");
})();
