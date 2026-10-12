import type { Extensions } from "@tiptap/core";
import { Placeholder } from "@tiptap/extensions";
import Highlight from "@tiptap/extension-highlight";
import Mention from "@tiptap/extension-mention";
import { TableKit } from "@tiptap/extension-table";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { StarterKit } from "@tiptap/starter-kit";

import type { RichTextEditorFeatures, RichTextMentionSource } from "./types";

export interface CreateRichTextExtensionsOptions
  extends RichTextEditorFeatures {
  /**
   * Placeholder shown on empty paragraphs. Rendered as
   * `.is-empty:before { content: attr(data-placeholder) }` by CSS.
   */
  placeholder?: string;
  /** Async or sync source for `@` mention suggestions. */
  mentionItems?: RichTextMentionSource;
}

/**
 * Builds the Tiptap v3 extension list. StarterKit already provides
 * headings (levels 1-3), lists, marks (bold/italic/underline/strike/code),
 * blockquote, code block, horizontal rule, link, history, dropcursor and
 * gapcursor. Everything else is opt-in via `features`.
 */
export function createRichTextExtensions(
  options: CreateRichTextExtensionsOptions = {}
): Extensions {
  const {
    highlights = true,
    mentionItems,
    mentions = true,
    placeholder,
    tables = true,
    tasks = true,
  } = options;

  const extensions: Extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: { autolink: true, openOnClick: false },
    }),
    Placeholder.configure({
      includeChildren: true,
      placeholder: placeholder ?? "Escribe algo…",
    }),
  ];

  if (highlights) {
    extensions.push(Highlight.configure({ multicolor: true }));
  }

  if (tasks) {
    extensions.push(TaskList, TaskItem.configure({ nested: true }));
  }

  if (tables) {
    extensions.push(
      TableKit.configure({ table: { lastColumnResizable: true, resizable: true } })
    );
  }

  if (mentions) {
    extensions.push(
      Mention.configure({
        HTMLAttributes: { "data-type": "mention" },
        suggestion: {
          items: ({ query }) => mentionItems?.(query) ?? [],
        },
      })
    );
  }

  return extensions;
}
