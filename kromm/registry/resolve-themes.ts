import type { RegistryItem } from "shadcn/schema";
import { z } from "zod";

import { parseData } from "./parse";
import { themeDefinitionSchema } from "./schemas";
import themesData from "@/registry/data/themes.json";

const themes = parseData(
  themesData,
  z.array(themeDefinitionSchema),
  "registry/data/themes.json"
);

export type Theme = (typeof THEMES)[number];

export const THEMES: RegistryItem[] = themes.map(
  (theme): RegistryItem => ({
    cssVars: theme.cssVars,
    name: theme.name,
    title: theme.title,
    type: "registry:theme",
  })
);
