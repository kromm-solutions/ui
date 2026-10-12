import type { RegistryItem } from "shadcn/schema";
import { z } from "zod";

import { parseData } from "./parse";
import { baseDefinitionSchema } from "./schemas";
import basesData from "@/registry/data/bases.json";

const bases = parseData(
  basesData,
  z.array(baseDefinitionSchema),
  "registry/data/bases.json"
);

/** Registry items (type `registry:style`) consumed by docs and the build script. */
export const BASES: RegistryItem[] = bases.map(
  (base): RegistryItem => ({
    dependencies: base.dependencies,
    description: base.description,
    meta: base.meta,
    name: base.name,
    title: base.title,
    type: "registry:style",
  })
);

export const BASE_NAMES = bases.map((base) => base.name);

export type Base = (typeof BASES)[number];
