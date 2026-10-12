"use client";

import { cn } from "cn";
import * as React from "react";

import type {
  RichTextEditorFeatures,
  RichTextEditorRef,
  RichTextMentionSource,
  RichTextValue,
} from "./core/types";
import { useRichTextEditorInstance } from "./hooks/use-rich-text-editor";
import { RichTextEditorProvider } from "./rich-text-editor-context";

type RichTextEditorProps = React.ComponentProps<"div"> & {
  /** Controlled document (ProseMirror JSON). */
  value?: RichTextValue;
  /** Initial document for uncontrolled usage. */
  defaultValue?: RichTextValue;

  /** Fires with the JSON document on every update. */
  onValueChange?: (value: RichTextValue) => void;

  /** Placeholder rendered on empty paragraphs. */
  placeholder?: string;

  readOnly?: boolean;
  disabled?: boolean;

  /** Opt-in feature flags; everything is on by default. */
  features?: RichTextEditorFeatures;

  /** Source for `@` mention suggestions. */
  mentionItems?: RichTextMentionSource;

  /** Accessible label for the editable area. */
  ariaLabel?: string;
};

export const RichTextEditor = React.forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(function RichTextEditor(
  {
    ariaLabel,
    className,
    defaultValue,
    disabled = false,
    features,
    mentionItems,
    onValueChange,
    placeholder,
    readOnly = false,
    value,
    children,
    ...props
  },
  ref
) {
  const editor = useRichTextEditorInstance({
    ariaLabel,
    defaultValue,
    disabled,
    features,
    mentionItems,
    onValueChange,
    placeholder,
    readOnly,
    value,
  });

  React.useImperativeHandle(
    ref,
    (): RichTextEditorRef => ({
      clear: () => editor?.commands.clearContent(true),
      editor,
      focus: () => editor?.commands.focus(),
      getHTML: () => editor?.getHTML() ?? "",
      getJSON: () => editor?.getJSON() ?? null,
      getText: () => editor?.getText() ?? "",
      isEmpty: () => editor?.isEmpty ?? true,
      setContent: (next) => {
        editor?.commands.setContent(next ?? "", { emitUpdate: false });
      },
    }),
    [editor]
  );

  const resolvedFeatures = React.useMemo(
    () => ({
      blockHandle: features?.blockHandle ?? true,
      bubbleMenu: features?.bubbleMenu ?? true,
      highlights: features?.highlights ?? true,
      mentions: features?.mentions ?? true,
      tables: features?.tables ?? true,
      tasks: features?.tasks ?? true,
    }),
    [features]
  );

  return (
    <RichTextEditorProvider
      disabled={disabled}
      editor={editor}
      features={resolvedFeatures}
      readOnly={readOnly}
    >
      <div
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-slot="rich-text-editor"
        className={cn(
          "relative flex w-full min-w-0 flex-col overflow-hidden",
          "rounded-md border bg-background",
          "transition-[color,box-shadow]",
          "has-[[data-slot=rich-text-editor-content]:focus-within]:border-ring",
          "has-[[data-slot=rich-text-editor-content]:focus-within]:ring-2",
          "has-[[data-slot=rich-text-editor-content]:focus-within]:ring-ring/30",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RichTextEditorProvider>
  );
});
