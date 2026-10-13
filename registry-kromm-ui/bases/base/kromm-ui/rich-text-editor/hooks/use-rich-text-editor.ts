"use client";

import type { Editor, JSONContent } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import * as React from "react";

import type { CreateRichTextExtensionsOptions } from "../core/extensions";
import { createRichTextExtensions } from "../core/extensions";
import { isSameRichTextDocument } from "../core/serialization";
import type { RichTextValue } from "../core/types";

export interface UseRichTextEditorOptions extends CreateRichTextExtensionsOptions {
  value?: RichTextValue;
  defaultValue?: RichTextValue;
  onValueChange?: (value: JSONContent) => void;
  disabled?: boolean;
  readOnly?: boolean;
  /**
   * Accessible label applied to the editable element.
   * @default "Rich text editor"
   */
  ariaLabel?: string;
}

/**
 * Creates and owns the Tiptap editor instance.
 *
 * Tiptap is not controlled: `value` is synced in when it differs from
 * the current document, and `onValueChange` fires on every update.
 */
export function useRichTextEditorInstance({
  ariaLabel = "Rich text editor",
  defaultValue,
  disabled = false,
  mentionItems,
  features,
  onValueChange,
  placeholder,
  readOnly = false,
  value,
}: UseRichTextEditorOptions & {
  features?: CreateRichTextExtensionsOptions;
}): Editor | null {
  const resolvedFeatures = features ?? {};

  const extensions = React.useMemo(
    () =>
      createRichTextExtensions({
        ...resolvedFeatures,
        mentionItems,
        placeholder,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mentionItems, placeholder, JSON.stringify(resolvedFeatures)]
  );

  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const editor = useEditor({
    content: defaultValue ?? value ?? undefined,
    editable: !(disabled || readOnly),
    editorProps: {
      attributes: {
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class: "tiptap ProseMirror",
        role: "textbox",
        tabindex: "0",
      },
    },
    extensions,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onValueChangeRef.current?.(instance.getJSON());
    },
  });

  // Controlled sync: push an external `value` in when it really changed.
  React.useEffect(() => {
    if (!editor || value === undefined) {
      return;
    }

    if (!isSameRichTextDocument(editor.getJSON(), value)) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
  }, [editor, value]);

  // Keep editable in sync with disabled/readOnly.
  React.useEffect(() => {
    editor?.setEditable(!(disabled || readOnly));
  }, [editor, disabled, readOnly]);

  return editor;
}
