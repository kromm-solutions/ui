import type { Extensions, JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/core";

import { createRichTextExtensions } from "./extensions";
import type { RichTextValue } from "./types";

/**
 * Server-safe serializers built on `generateHTML` / `generateJSON`,
 * which never create an Editor instance (no DOM needed).
 */

export interface RichTextSerializationOptions {
  /** Extra extensions to include alongside the default set. */
  extensions?: Extensions;
}

function resolveExtensions(options?: RichTextSerializationOptions): Extensions {
  return [...createRichTextExtensions(), ...(options?.extensions ?? [])];
}

/** Convert a stored ProseMirror document to HTML (SSR, SEO, email). */
export function richTextToHTML(
  value: RichTextValue,
  options?: RichTextSerializationOptions
): string {
  if (!value) {
    return "";
  }

  return generateHTML(value, resolveExtensions(options));
}

/** Convert an HTML string (pasted/imported content) to a document. */
export function htmlToRichText(
  html: string,
  options?: RichTextSerializationOptions
): JSONContent {
  return generateJSON(html, resolveExtensions(options));
}

/** Shallow-enough JSON comparison used to sync a controlled value. */
export function isSameRichTextDocument(
  a: RichTextValue,
  b: RichTextValue
): boolean {
  if (!a || !b) {
    return a === b;
  }

  return JSON.stringify(a) === JSON.stringify(b);
}
