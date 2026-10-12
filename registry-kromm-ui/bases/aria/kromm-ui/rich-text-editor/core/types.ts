import type { Editor, JSONContent } from "@tiptap/core";

/** The editor value is a ProseMirror JSON document. */
export type RichTextValue = JSONContent | null;

export type RichTextHighlightColor =
  | "yellow"
  | "green"
  | "blue"
  | "pink"
  | "violet";

/** Opt-in feature flags. Everything defaults to on. */
export interface RichTextEditorFeatures {
  /** Floating menu shown over the current text selection. */
  bubbleMenu?: boolean;
  /** "+" and drag handle shown at the start of the hovered block. */
  blockHandle?: boolean;
  /** Multicolor highlight mark (`mark[data-color]`). */
  highlights?: boolean;
  /** `@` mention nodes. */
  mentions?: boolean;
  /** Resizable tables. */
  tables?: boolean;
  /** Task lists with checkable items. */
  tasks?: boolean;
}

export interface RichTextMentionItem {
  id: string;
  label: string;
}

export type RichTextMentionSource = (
  query: string
) => RichTextMentionItem[] | Promise<RichTextMentionItem[]>;

/** Imperative handle exposed by the root through `ref`. */
export interface RichTextEditorRef {
  getJSON: () => JSONContent | null;
  getHTML: () => string;
  getText: () => string;
  setContent: (value: RichTextValue) => void;
  clear: () => void;
  focus: () => void;
  isEmpty: () => boolean;
  editor: Editor | null;
}

export interface RichTextEditorContextValue {
  editor: Editor | null;
  disabled: boolean;
  readOnly: boolean;
  features: Required<RichTextEditorFeatures>;
}

/** Toolbar command names understood by `RichTextEditorToolbarCommand`. */
export type RichTextCommand =
  | "undo"
  | "redo"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "codeBlock"
  | "blockquote"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "heading1"
  | "heading2"
  | "heading3"
  | "horizontalRule"
  | "insertTable"
  | "unsetHighlights";
