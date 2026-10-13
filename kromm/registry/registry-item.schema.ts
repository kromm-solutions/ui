import { z } from "zod";

export const registryItemKindSchema = z.enum([
  "component",
  "block",
  "template",
  "hook",
  "ui",
]);

export const registryItemMetaSchema = z.object({
  order: z.number().int().nonnegative().optional(),
  seo: z
    .object({
      description: z.string().optional(),
      ogImage: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const registryItemSchema = z.object({
  base: z.enum(["base", "aria", "radix"]),
  description: z.string().min(1),
  id: z.string().min(1),
  kind: registryItemKindSchema,
  meta: registryItemMetaSchema.optional(),
  name: z.string().min(1),
  registryPath: z.string().min(1),
  title: z.string().min(1),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
