"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

/** Snapshot of everything toolbars and menus need to render. */
export interface RichTextEditorState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  codeBlock: boolean;
  blockquote: boolean;
  bulletList: boolean;
  orderedList: boolean;
  taskList: boolean;
  heading1: boolean;
  heading2: boolean;
  heading3: boolean;
  link: boolean;
  highlightColor: string | null;
  /** Character offset of the current selection (-1 when empty selection). */
  selectionFrom: number;
  selectionTo: number;
  isSelectionEmpty: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const EMPTY_STATE: RichTextEditorState = {
  blockquote: false,
  bold: false,
  bulletList: false,
  canRedo: false,
  canUndo: false,
  code: false,
  codeBlock: false,
  heading1: false,
  heading2: false,
  heading3: false,
  highlightColor: null,
  isSelectionEmpty: true,
  italic: false,
  link: false,
  orderedList: false,
  selectionFrom: -1,
  selectionTo: -1,
  strike: false,
  taskList: false,
  underline: false,
};

/**
 * Reads toolbar state with `useEditorState` so the parent only
 * re-renders when the selected slice changes. Never call
 * `editor.isActive()` during render; use this hook instead.
 */
export function useRichTextEditorState(
  editor: Editor | null
): RichTextEditorState {
  return (
    useEditorState({
      editor,
      selector: (ctx) => {
        if (!ctx.editor) {
          return EMPTY_STATE;
        }

        const e = ctx.editor;
        const { empty, from, to } = e.state.selection;

        return {
          blockquote: e.isActive("blockquote"),
          bold: e.isActive("bold"),
          bulletList: e.isActive("bulletList"),
          canRedo: e.can().redo(),
          canUndo: e.can().undo(),
          code: e.isActive("code"),
          codeBlock: e.isActive("codeBlock"),
          heading1: e.isActive("heading", { level: 1 }),
          heading2: e.isActive("heading", { level: 2 }),
          heading3: e.isActive("heading", { level: 3 }),
          highlightColor:
            (e.getAttributes("highlight").color as string | undefined) ?? null,
          isSelectionEmpty: empty,
          italic: e.isActive("italic"),
          link: e.isActive("link"),
          orderedList: e.isActive("orderedList"),
          selectionFrom: from,
          selectionTo: to,
          strike: e.isActive("strike"),
          taskList: e.isActive("taskList"),
          underline: e.isActive("underline"),
        };
      },
    }) ?? EMPTY_STATE
  );
}
