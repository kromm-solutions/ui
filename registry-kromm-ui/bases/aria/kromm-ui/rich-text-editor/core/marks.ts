import type { RichTextHighlightColor } from "./types";

/**
 * The five highlight colors supported by the highlight mark.
 * Rendering maps `mark[data-color]` to the CSS variables
 * `--highlight-{color}` registered by the registry item, so every
 * shadcn theme can restyle them. Never hardcode Tailwind color
 * classes for highlights.
 */
export const RICH_TEXT_HIGHLIGHT_COLORS: readonly RichTextHighlightColor[] = [
  "yellow",
  "green",
  "blue",
  "pink",
  "violet",
];

export function isRichTextHighlightColor(
  value: unknown
): value is RichTextHighlightColor {
  return (
    typeof value === "string" &&
    (RICH_TEXT_HIGHLIGHT_COLORS as readonly string[]).includes(value)
  );
}
