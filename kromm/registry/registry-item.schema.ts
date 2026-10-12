import { z } from "zod";

export const registryItemKindSchema = z.enum(["component", "block", "template", "hook", "ui"]);

export const registryItemMetaSchema = z.object({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
  order: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
});

export const registryItemSchema = z.object({
  id: z.string().min(1),
  kind: registryItemKindSchema,
  base: z.enum(["base", "aria", "radix"]),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  meta: registryItemMetaSchema.optional(),
  registryPath: z.string().min(1),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
