export { RichTextEditor } from "./rich-text-editor";

export { RichTextEditorContent } from "./rich-text-editor-content";

export {
  RichTextEditorProvider,
  useRichTextEditor,
} from "./rich-text-editor-context";

export {
  RichTextEditorToolbar,
  RichTextEditorToolbarButton,
  RichTextEditorToolbarGroup,
  RichTextEditorToolbarSeparator,
} from "./components/rich-text-editor-toolbar";

export { RichTextEditorBubbleMenu } from "./components/rich-text-editor-bubble-menu";

export { RichTextEditorBlockHandle } from "./components/rich-text-editor-block-handle";

export { useRichTextEditorInstance } from "./hooks/use-rich-text-editor";

export { useRichTextEditorState } from "./hooks/use-editor-state";

export type { RichTextEditorState } from "./hooks/use-editor-state";

export { createRichTextExtensions } from "./core/extensions";

export type { CreateRichTextExtensionsOptions } from "./core/extensions";

export {
  htmlToRichText,
  isSameRichTextDocument,
  richTextToHTML,
} from "./core/serialization";

export {
  isRichTextHighlightColor,
  RICH_TEXT_HIGHLIGHT_COLORS,
} from "./core/marks";

export type {
  RichTextCommand,
  RichTextEditorContextValue,
  RichTextEditorFeatures,
  RichTextEditorRef,
  RichTextHighlightColor,
  RichTextMentionItem,
  RichTextMentionSource,
  RichTextValue,
} from "./core/types";
