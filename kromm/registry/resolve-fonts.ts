import type { RegistryItem } from "shadcn/schema";
import { z } from "zod";

import { parseData } from "./parse";
import { fontDefinitionSchema } from "./schemas";
import type { FontDefinition } from "./schemas";
import fontsData from "@/registry/data/fonts.json";

const definitions = parseData(
  fontsData,
  z.array(fontDefinitionSchema),
  "registry/data/fonts.json"
);

export type { FontDefinition };
export type FontName = FontDefinition["name"];

function createFontItem(definition: FontDefinition, role: "body" | "heading") {
  return {
    font: {
      family: definition.family,
      provider: definition.provider,
      variable:
        role === "body" ? definition.registryVariable : "--font-heading",
      ...(definition.weight ? { weight: [...definition.weight] } : {}),
      subsets: [...definition.subsets],
      import: definition.import,
      dependency: definition.dependency,
    },
    name:
      role === "body"
        ? `font-${definition.name}`
        : `font-heading-${definition.name}`,
    title: role === "body" ? definition.title : `${definition.title} (Heading)`,
    type: "registry:font",
  } satisfies RegistryItem;
}

export const FONT_DEFINITIONS: readonly FontDefinition[] = definitions;

export const bodyFonts = definitions.map((definition) =>
  createFontItem(definition, "body")
) satisfies RegistryItem[];

export const headingFonts = definitions.map((definition) =>
  createFontItem(definition, "heading")
) satisfies RegistryItem[];

export const fonts = [...bodyFonts, ...headingFonts] satisfies RegistryItem[];
