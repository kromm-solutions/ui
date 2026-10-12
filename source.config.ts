import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { rehypePrettyCode } from "rehype-pretty-code";
import { z } from "zod";

import { DOCS_DIR } from "@/lib/docs";
import { transformers } from "@/lib/highlight-code";

/**
 * Frontmatter shared by every docs page, plus the changelog metadata:
 * `date`, `version` and `tags` are the source of truth for the changelog grid.
 * The default schema strips unknown keys, so they must be declared here.
 */
const docsFrontmatterSchema = frontmatterSchema.extend({
  date: z.union([z.string(), z.date()]).optional(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);

      return plugins;
    },
  },
});

export const docs = defineDocs({
  dir: DOCS_DIR,
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: docsFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});
