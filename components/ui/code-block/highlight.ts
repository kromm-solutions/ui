import { codeToHtml } from "shiki";
import type { ShikiTransformer } from "shiki";

/**
 * Same theme pair the docs pipeline uses, so highlighted code keeps its
 * `--shiki-light` / `--shiki-dark` variables and can be themed by CSS.
 */
export const CODE_BLOCK_THEMES = {
  dark: "github-dark",
  light: "github-light",
} as const;

const createTransformers = ({
  label,
  lineNumbers,
}: {
  label: string;
  lineNumbers: boolean;
}): ShikiTransformer[] => [
  {
    pre(node) {
      // A scroll container must be reachable by keyboard, so it carries the
      // role, the name and the focus stop itself. The indicator is an inset
      // outline: an outer one would be clipped by the rounded surface, and
      // `outline-none` is deliberately absent because it also pins
      // `--tw-outline-style` to `none`, which `outline-<width>` reads.
      node.properties.class =
        "min-w-0 overflow-x-auto px-4 py-3.5 text-[0.8125rem] leading-[1.6] !bg-transparent focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2";
      node.properties.tabIndex = 0;
      node.properties.role = "region";
      node.properties["aria-label"] = label;
    },
  },
  {
    code(node) {
      if (lineNumbers) {
        node.properties["data-line-numbers"] = "";
      }
    },
    line(node) {
      node.properties["data-line"] = "";
    },
  },
];

export const highlightCodeBlock = async (
  code: string,
  language: string,
  { label, lineNumbers }: { label: string; lineNumbers: boolean }
) => {
  const options = {
    themes: CODE_BLOCK_THEMES,
    transformers: createTransformers({ label, lineNumbers }),
  };

  try {
    return await codeToHtml(code, { ...options, lang: language });
  } catch {
    // Unknown or unsupported language: render the source as plain text
    // instead of failing the whole page.
    return await codeToHtml(code, { ...options, lang: "text" });
  }
};
