import { z } from "zod";

import { parseData } from "./parse";
import { styleDefinitionSchema } from "./schemas";
import type { StyleDefinition } from "./schemas";
import stylesData from "@/registry/data/styles.json";

const styles = parseData(
  stylesData,
  z.array(styleDefinitionSchema),
  "registry/data/styles.json"
);

export type { StyleDefinition };

/** Style list used by the build to produce `{base}-{style}` registry outputs. */
export const STYLES: StyleDefinition[] = styles;
