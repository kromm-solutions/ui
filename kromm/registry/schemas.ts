import { z } from "zod";

/**
 * Zod schemas for the declarative data in `registry/data/*.json`.
 * The JSON files carry pure data only; `type` fields of registry items
 * are injected by the resolvers, never duplicated per item in the data.
 *
 * Key order matters: `shadcn build` serializes item keys in schema order, and
 * the repo pins baseline parity for `public/r/themes/registry.json`
 * (light before dark inside `cssVars`).
 */

export const cssVarsSchema = z.object({
  dark: z.record(z.string(), z.string()),
  light: z.record(z.string(), z.string()),
});

export const themeDefinitionSchema = z
  .object({
    cssVars: cssVarsSchema,
    name: z.string().min(1),
    title: z.string().min(1),
  })
  .refine((theme) => theme.name !== "registry", {
    message: `Theme name "registry" is reserved and would collide with registry.json`,
  });

export const fontDefinitionSchema = z.object({
  dependency: z.string().min(1),
  family: z.string().min(1),
  import: z.string().min(1),
  name: z.string().min(1),
  previewVariable: z.string().min(1),
  provider: z.literal("google"),
  registryVariable: z.enum(["--font-sans", "--font-mono", "--font-serif"]),
  subsets: z.array(z.string()).min(1),
  title: z.string().min(1),
  type: z.enum(["sans", "mono", "serif"]),
  weight: z.array(z.string()).optional(),
});

export const baseDefinitionSchema = z.object({
  dependencies: z.array(z.string()).min(1),
  description: z.string().min(1),
  meta: z.object({ logo: z.string().min(1) }),
  name: z.string().min(1),
  title: z.string().min(1),
});

export const styleDefinitionSchema = z.object({
  description: z.string().min(1),
  iconSvg: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
});

export const exampleEntrySchema = z.object({
  description: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
});

export const exampleMetaSchema = z.array(exampleEntrySchema);

export type ThemeDefinition = z.infer<typeof themeDefinitionSchema>;
export type FontDefinition = z.infer<typeof fontDefinitionSchema>;
export type BaseDefinition = z.infer<typeof baseDefinitionSchema>;
export type StyleDefinition = z.infer<typeof styleDefinitionSchema>;
export type ExampleEntry = z.infer<typeof exampleEntrySchema>;
