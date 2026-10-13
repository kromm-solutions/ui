import { readFileSync } from "node:fs";
import { join } from "node:path";

interface MetaEntry {
  name: string;
  title: string;
  description: string;
  order: number;
}
interface CatalogComponent {
  title: string;
  name: string;
  description: string;
  patterns: MetaEntry[];
  base: string;
}

const bases = ["base", "aria", "radix"];
const registryRoot = join(
  process.cwd(),
  "../../packages/registry/registry-kromm-ui"
);

function loadMeta(base: string, component: string): MetaEntry[] {
  const metaPath = join(
    registryRoot,
    "bases",
    base,
    "examples",
    component,
    "meta.json"
  );
  try {
    const raw = readFileSync(metaPath, "utf-8");
    return JSON.parse(raw) as MetaEntry[];
  } catch {
    return [];
  }
}

function listComponents(base: string): string[] {
  const examplesDir = join(registryRoot, "bases", base, "examples");
  try {
    const fs = require("node:fs");
    return fs.readdirSync(examplesDir).filter((f: string) => {
      const stat = fs.statSync(join(examplesDir, f));
      return stat.isDirectory();
    });
  } catch {
    return [];
  }
}

export function getCatalog(): CatalogComponent[] {
  const items: CatalogComponent[] = [];
  for (const base of bases) {
    const comps = listComponents(base);
    for (const comp of comps) {
      const meta = loadMeta(base, comp);
      if (!meta.length) {
        continue;
      }
      items.push({
        base,
        description: meta[0]?.description ?? "",
        name: comp
          .split("-")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" "),
        patterns: meta,
        title: comp,
      });
    }
  }
  return items;
}

export function getComponent(
  base: string,
  title: string
): CatalogComponent | undefined {
  return getCatalog().find((c) => c.base === base && c.title === title);
}
