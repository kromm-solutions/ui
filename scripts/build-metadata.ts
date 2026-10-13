import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const EXAMPLE_META_SCHEMA = z.array(
  z.object({
    description: z.string().min(1),
    name: z.string().min(1),
    order: z.number().int().nonnegative(),
    title: z.string().min(1),
  })
);

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY_DIR = path.join(ROOT, "registry-kromm-ui");
const META_OUT = path.join(REGISTRY_DIR, "_meta");
const EXAMPLES_ROOT = path.join(REGISTRY_DIR, "bases");

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function build() {
  await fs.rm(META_OUT, { force: true, recursive: true });
  const bases = await fs.readdir(EXAMPLES_ROOT, { withFileTypes: true });
  for (const b of bases) {
    if (!b.isDirectory()) {
      continue;
    }
    const baseName = b.name;
    const examplesRoot = path.join(EXAMPLES_ROOT, baseName, "examples");
    try {
      const comps = await fs.readdir(examplesRoot, { withFileTypes: true });
      for (const c of comps) {
        if (!c.isDirectory()) {
          continue;
        }
        const compName = c.name;
        const compDir = path.join(examplesRoot, compName);
        const metaPath = path.join(compDir, "meta.json");
        let metaEntries: z.infer<typeof EXAMPLE_META_SCHEMA> = [];
        try {
          const raw = await fs.readFile(metaPath, "utf-8");
          metaEntries = EXAMPLE_META_SCHEMA.parse(JSON.parse(raw));
        } catch (error) {
          console.warn(`⚠️ meta.json inválido en ${compDir}: ${error}`);
          continue;
        }
        const outDir = path.join(META_OUT, "components", "bases", baseName);
        await ensureDir(outDir);
        const entryList = [];
        for (const entry of metaEntries) {
          const fileName = `${entry.name}.tsx`;
          const filePath = path.join(compDir, fileName);
          try {
            await fs.access(filePath);
          } catch {
            continue;
          }
          const relPath = path.relative(ROOT, filePath).replaceAll("\\", "/");
          entryList.push({
            ...entry,
            file: relPath,
            path: `registry-kromm-ui/bases/${baseName}/examples/${compName}/${fileName}`,
          });
        }
        const outFile = path.join(outDir, `${compName}.json`);
        await fs.writeFile(
          outFile,
          JSON.stringify(entryList, null, 2),
          "utf-8"
        );
      }
    } catch {
      /* unparseable meta.json — counted as missing */
    }
  }
  console.log(
    "✅ Metadatos de componentes generados en registry-kromm-ui/_meta"
  );
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
