import { createHash } from "node:crypto";

import { LRUCache } from "lru-cache";
import type { ShikiTransformer } from "shiki";
import { codeToHtml } from "shiki";

const highlightCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 60,
});

export const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source;
        node.properties.__raw__ = raw;

        const isInstall =
          raw.startsWith("npm install") ||
          raw.startsWith("pnpm install") ||
          raw.startsWith("pnpm add") ||
          raw.startsWith("yarn add") ||
          raw.startsWith("bun add");

        const isDlx =
          raw.startsWith("npx ") ||
          raw.startsWith("pnpm dlx ") ||
          raw.startsWith("yarn dlx ") ||
          raw.startsWith("bunx ");

        if (isInstall) {
          const pkg = raw
            .replace(
              /^(npm install|pnpm install|pnpm add|yarn add|bun add)\s*/,
              ""
            )
            .trim();
          node.properties.__npm__ = pkg ? `npm install ${pkg}` : "npm install";
          node.properties.__yarn__ = pkg ? `yarn add ${pkg}` : "yarn install";
          node.properties.__pnpm__ = pkg ? `pnpm add ${pkg}` : "pnpm install";
          node.properties.__bun__ = pkg ? `bun add ${pkg}` : "bun install";
        } else if (raw.startsWith("npx create-")) {
          node.properties.__npm__ = raw;
          node.properties.__yarn__ = raw.replace("npx create-", "yarn create ");
          node.properties.__pnpm__ = raw.replace("npx create-", "pnpm create ");
          node.properties.__bun__ = raw.replace("npx", "bunx --bun");
        } else if (raw.startsWith("npm create")) {
          node.properties.__npm__ = raw;
          node.properties.__yarn__ = raw.replace("npm create", "yarn create");
          node.properties.__pnpm__ = raw.replace("npm create", "pnpm create");
          node.properties.__bun__ = raw.replace("npm create", "bun create");
        } else if (isDlx) {
          const cmd = raw
            .replace(/^(npx|pnpm dlx|yarn dlx|bunx --bun|bunx)\s*/, "")
            .trim();
          node.properties.__npm__ = `npx ${cmd}`;
          node.properties.__yarn__ = `yarn dlx ${cmd}`;
          node.properties.__pnpm__ = `pnpm dlx ${cmd}`;
          node.properties.__bun__ = `bunx --bun ${cmd}`;
        } else if (raw.startsWith("npm run")) {
          node.properties.__npm__ = raw;
          node.properties.__yarn__ = raw.replace("npm run", "yarn");
          node.properties.__pnpm__ = raw.replace("npm run", "pnpm");
          node.properties.__bun__ = raw.replace("npm run", "bun");
        }
      }
    },
  },
] as ShikiTransformer[];

export const highlightCode = async (code: string, language = "tsx") => {
  const cacheKey = createHash("sha256")
    .update(`${language}:${code}`)
    .digest("hex");

  const cached = highlightCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [
      {
        code(node) {
          node.properties["data-line-numbers"] = "";
        },
        line(node) {
          node.properties["data-line"] = "";
        },
        pre(node) {
          node.properties.class =
            "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent";
        },
      },
    ],
  });

  highlightCache.set(cacheKey, html);

  return html;
};
