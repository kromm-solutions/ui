import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { createJiti } from "jiti";
import type { Registry } from "shadcn/schema";

// Flat repo layout: this script lives in scripts/, so the repo root
// (registry/, registry-kromm-ui/, kromm/) is one level up — never
// process.cwd(). The distribution output is public/r at the repo root.
const ROOT = path.resolve(import.meta.dirname, "..");
const APP_PUBLIC_R = path.resolve(ROOT, "public", "r");

// Style-aware sources carry Tailwind tokens like
// `style-vega:rounded-sm style-nova:rounded-md` (variants declared in
// styles/globals.css). At build time we resolve each combination down to the
// utilities of the style being generated — consumers receive plain classes,
// no variant machinery required in their app (vendored from reui.io).
const GENERATED_ROOT = path.join(ROOT, ".generated", "registry-styles");

const outArg = process.argv.find((arg) => arg.startsWith("--out="));
const PUBLIC_R = outArg ? path.resolve(outArg.slice(6)) : APP_PUBLIC_R;

const jiti = createJiti(import.meta.url, {
  alias: {
    "@": ROOT,
  },
  jsx: true,
});

const { BASES, STYLES, THEMES, fonts } = jiti("@/kromm/registry") as {
  BASES: { name: string; title: string }[];
  STYLES: { name: string; title: string }[];
  THEMES: Registry["items"];
  fonts: Registry["items"];
};

// ---------------------------------------------------------------------------
// Style-variant resolution (vendored from reui.io's build-registry.mts).
// ---------------------------------------------------------------------------
const styleNamesPattern = STYLES.map((s) => s.name).join("|");
// Only single-line quoted strings are matched; multi-line template literals
// with style tokens would survive as residuals and are caught by verify.
const QUOTED_STYLE_VARIANT_RE = new RegExp(
  `(["'\`])((?:(?!\\1)[^\\n])*\\bstyle-(?:${styleNamesPattern}):(?:(?!\\1)[^\\n])*)\\1`,
  "g"
);

function transformStyleVariants(code: string, styleName: string): string {
  return code.replace(
    QUOTED_STYLE_VARIANT_RE,
    (_match, quote: string, inner: string) => {
      const resolved = inner.replaceAll(
        new RegExp(`\\bstyle-(${styleNamesPattern}):([^\\s{}]+)`, "g"),
        (_token, name: string, utility: string) =>
          name === styleName ? ` ${utility} ` : " "
      );
      return `${quote}${resolved.replaceAll(/\s+/g, " ").trim()}${quote}`;
    }
  );
}

function isStyleAware(content: string): boolean {
  return new RegExp(`\\bstyle-(?:${styleNamesPattern}):`).test(content);
}

// ---------------------------------------------------------------------------
// Dependency ground-truthing: union every npm package the source imports
// into the item's dependencies, so the CLI always installs what the code
// imports (hand declarations stay; inference only adds).
// ---------------------------------------------------------------------------
const SCAFFOLD_PACKAGES = new Set(["react", "react-dom", "next"]);

const IMPORT_PATTERNS = [
  /from\s+["']([^"']+)["']/g,
  /import\s+["']([^"']+)["']/g,
  /import\(\s*["']([^"']+)["']\s*\)/g,
  /require\(\s*["']([^"']+)["']\s*\)/g,
];

function stripTemplateLiteralContent(code: string): string {
  return code.replaceAll(
    /`(?:\\[\s\S]|\${[^`]*}*|[^\\`])*`/g,
    (literal) =>
      `\`${literal
        .slice(1, -1)
        .replaceAll(/\{\{[^}]*\}\}/g, " ")
        .replaceAll(/[^{}\n]/g, " ")}\``
  );
}

function packageNameFromImport(spec: string): string | null {
  if (/[\s$(){}`]/.test(spec)) {
    return null;
  }
  if (spec.startsWith(".") || spec.startsWith("@/") || spec.startsWith("/")) {
    return null;
  }
  if (spec.startsWith("node:")) {
    return null;
  }
  const parts = spec.split("/");
  return spec.startsWith("@") ? `${parts[0]}/${parts[1]}` : (parts[0] ?? null);
}

async function inferItemDependencies(item: Registry["items"][number]) {
  const imported = new Set<string>();
  for (const file of item.files ?? []) {
    const absolute = path.resolve(ROOT, file.path);
    let content: string;
    try {
      content = await fs.readFile(absolute, "utf-8");
    } catch {
      continue;
    }
    const source = stripTemplateLiteralContent(content);
    for (const pattern of IMPORT_PATTERNS) {
      for (const match of source.matchAll(pattern)) {
        const name = packageNameFromImport(match[1]);
        if (name && !SCAFFOLD_PACKAGES.has(name)) {
          imported.add(name);
        }
      }
    }
  }
  if (imported.size === 0) {
    return item;
  }
  const declared = new Set(item.dependencies ?? []);
  for (const name of imported) {
    declared.add(name);
  }
  return {
    ...item,
    dependencies: [...declared].toSorted((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    ),
  };
}

// ---------------------------------------------------------------------------
// Namespacing: registryDependencies naming one of our own items must resolve
// through the consumer's @kromm registry alias, not the upstream shadcn one.
// ---------------------------------------------------------------------------
function resolveRegistryDeps(
  items: Registry["items"],
  knownNames: Set<string>
): Registry["items"] {
  return items.map((item) => {
    if (!item.registryDependencies) {
      return item;
    }
    return {
      ...item,
      registryDependencies: item.registryDependencies.map((dep) =>
        knownNames.has(dep) && !dep.includes("/") && !dep.includes(":")
          ? `@kromm/${dep}`
          : dep
      ),
    };
  });
}

interface BaseItems {
  base: (typeof BASES)[number];
  items: Registry["items"];
}

async function loadBaseItems(): Promise<BaseItems[]> {
  const result: BaseItems[] = [];
  for (const base of BASES) {
    const items: Registry["items"] = [];

    // 1. Componentes base de registry/bases/{base}/registry
    const baseModulePath = `@/registry/bases/${base.name}/registry`;
    try {
      const baseMod = jiti(baseModulePath) as {
        ui?: Registry["items"];
        hooks?: Registry["items"];
      };
      if (baseMod.ui && baseMod.ui.length > 0) {
        items.push(...baseMod.ui);
      }
      if (baseMod.hooks && baseMod.hooks.length > 0) {
        items.push(...baseMod.hooks);
      }
    } catch {
      console.warn(`⚠️  Sin registry base para "${baseModulePath}"`);
    }

    // 2. Componentes y hooks propios de registry-kromm-ui si existen
    const customModulePath = `@/registry-kromm-ui/bases/${base.name}/kromm-ui/registry`;
    try {
      const customMod = jiti(customModulePath) as {
        ui?: Registry["items"];
        hooks?: Registry["items"];
      };
      if (customMod.ui && customMod.ui.length > 0) {
        items.push(...customMod.ui);
      }
      if (customMod.hooks && customMod.hooks.length > 0) {
        items.push(...customMod.hooks);
      }
    } catch {
      // opcional
    }

    const itemsWithResolvedPaths = items.map((item) => ({
      ...item,
      files: item.files?.map((file) => {
        const resolvedPath =
          file.path.startsWith("registry/") ||
          file.path.startsWith("registry-kromm-ui/")
            ? file.path
            : `registry/bases/${base.name}/${file.path}`;
        return { ...file, path: resolvedPath };
      }),
    }));

    const itemsWithDeps: Registry["items"] = [];
    for (const item of itemsWithResolvedPaths) {
      itemsWithDeps.push(await inferItemDependencies(item));
    }

    result.push({ base, items: itemsWithDeps });
  }
  return result;
}

async function buildRegistry() {
  try {
    const stylesBaseDir = path.join(PUBLIC_R, "styles");

    // Limpiar carpeta public/r/styles antes de compilar para eliminar JSONs innecesarios
    await fs.rm(stylesBaseDir, { force: true, recursive: true });
    await fs.mkdir(stylesBaseDir, { recursive: true });

    // Load every base first: the full item-name set is what decides which
    // bare registryDependencies become @kromm/<name>.
    const baseItems = await loadBaseItems();
    const knownNames = new Set(
      baseItems.flatMap(({ items }) => items.map((item) => item.name))
    );

    // Style-aware sources are materialised under .generated/ with the variant
    // tokens already resolved for the style being compiled.
    await fs.rm(GENERATED_ROOT, { force: true, recursive: true });
    await fs.mkdir(GENERATED_ROOT, { recursive: true });

    // 1. Compilar los componentes UI de cada combinación {base}-{style}
    for (const { base, items } of baseItems) {
      for (const style of STYLES) {
        const styleSlug = `${base.name}-${style.name}`;

        // Resolve style variant tokens per style. Only files authored with
        // style-*: tokens are copied into the generated mirror; everything
        // else points at the original source path.
        const styleItems = await Promise.all(
          items.map(async (item) => ({
            ...item,
            files: item.files
              ? await Promise.all(
                  item.files.map(async (file) => {
                    const absolute = path.resolve(ROOT, file.path);
                    let content: string;
                    try {
                      content = await fs.readFile(absolute, "utf-8");
                    } catch {
                      return file;
                    }
                    if (!isStyleAware(content)) {
                      return file;
                    }
                    const generatedRelative = path.join(
                      path.relative(ROOT, GENERATED_ROOT),
                      styleSlug,
                      file.path
                    );
                    const generatedAbsolute = path.resolve(
                      ROOT,
                      generatedRelative
                    );
                    await fs.mkdir(path.dirname(generatedAbsolute), {
                      recursive: true,
                    });
                    await fs.writeFile(
                      generatedAbsolute,
                      transformStyleVariants(content, style.name),
                      "utf-8"
                    );
                    return { ...file, path: generatedRelative };
                  })
                )
              : undefined,
          }))
        );

        const registryData: Registry = {
          homepage: "https://github.com/kromm-solutions/ui",
          items: resolveRegistryDeps(styleItems, knownNames),
          name: "kromm-ui",
        };

        const tempPath = path.join(os.tmpdir(), `registry-${styleSlug}.json`);
        const outputDir = path.resolve(stylesBaseDir, styleSlug);

        await fs.writeFile(
          tempPath,
          JSON.stringify(registryData, null, 2),
          "utf-8"
        );

        console.log(
          `📦 Compilando estilo "${styleSlug}" en ${path.relative(process.cwd(), outputDir)}...`
        );
        execSync(
          `pnpm exec shadcn build ${JSON.stringify(tempPath)} --output ${JSON.stringify(outputDir)}`,
          {
            cwd: ROOT,
            stdio: "inherit",
          }
        );

        await fs.rm(tempPath, { force: true });
      }
    }

    await fs.rm(GENERATED_ROOT, { force: true, recursive: true });

    // 2. Compilar los Temas en public/r/themes (una sola vez)
    if (THEMES && THEMES.length > 0) {
      const themesDir = path.join(PUBLIC_R, "themes");
      await fs.mkdir(themesDir, { recursive: true });
      const tempPath = path.join(os.tmpdir(), "registry-themes.json");
      await fs.writeFile(
        tempPath,
        JSON.stringify(
          {
            homepage: "https://github.com/kromm-solutions/ui",
            items: THEMES,
            name: "Kromm UI Themes",
          },
          null,
          2
        ),
        "utf-8"
      );
      console.log("🎨 Compilando temas en public/r/themes...");
      execSync(
        `pnpm exec shadcn build ${JSON.stringify(tempPath)} --output ${JSON.stringify(themesDir)}`,
        { cwd: ROOT, stdio: "inherit" }
      );
      await fs.rm(tempPath, { force: true });
    }

    // 3. Compilar las Fuentes en public/r/fonts (una sola vez)
    if (fonts && fonts.length > 0) {
      const fontsDir = path.join(PUBLIC_R, "fonts");
      await fs.mkdir(fontsDir, { recursive: true });
      const tempPath = path.join(os.tmpdir(), "registry-fonts.json");
      await fs.writeFile(
        tempPath,
        JSON.stringify(
          {
            homepage: "https://github.com/kromm-solutions/ui",
            items: fonts,
            name: "Kromm UI Fonts",
          },
          null,
          2
        ),
        "utf-8"
      );
      console.log("🔤 Compilando fuentes en public/r/fonts...");
      execSync(
        `pnpm exec shadcn build ${JSON.stringify(tempPath)} --output ${JSON.stringify(fontsDir)}`,
        { cwd: ROOT, stdio: "inherit" }
      );
      await fs.rm(tempPath, { force: true });
    }

    // 4. Generar public/r/styles/index.json
    const stylesIndex: { name: string; label: string }[] = [
      {
        label: "Default",
        name: "default",
      },
    ];

    for (const base of BASES) {
      for (const style of STYLES) {
        stylesIndex.push({
          label: `${base.title} ${style.title}`,
          name: `${base.name}-${style.name}`,
        });
      }
    }

    const indexJsonPath = path.resolve(stylesBaseDir, "index.json");
    await fs.writeFile(
      indexJsonPath,
      JSON.stringify(stylesIndex, null, 2),
      "utf-8"
    );

    console.log(
      `✅ Generado public/r/styles/index.json con ${stylesIndex.length} elementos.`
    );
    console.log("✅ ¡Compilación limpia finalizada!");
  } catch (error) {
    console.error("❌ Error compilando el registro:", error);
    await fs.rm(GENERATED_ROOT, { force: true, recursive: true });
    process.exit(1);
  }
}

buildRegistry();
