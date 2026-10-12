"use client";

import { cn } from "cn";
import { EditorContent } from "@tiptap/react";
import * as React from "react";

import { useRichTextEditor } from "./rich-text-editor-context";

/**
 * Editable surface. Content typography is expressed with
 * `[&_.tiptap_*]` selectors and theme tokens only — highlights are
 * colored through the `--highlight-*` variables registered in CSS.
 */
export function RichTextEditorContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { editor, readOnly, disabled } = useRichTextEditor();

  return (
    <EditorContent
      editor={editor}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-slot="rich-text-editor-content"
      className={cn(
        "text-foreground flex min-h-32 w-full flex-1 flex-col text-base/7",
        "[&_.tiptap]:flex-1 [&_.tiptap]:break-words [&_.tiptap]:outline-none",
        "[&_.tiptap]:px-4 [&_.tiptap]:py-3",
        "[&_.tiptap>*+*]:mt-3",
        "[&_.tiptap_h1]:text-2xl/9 [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:tracking-tight",
        "[&_.tiptap_h2]:text-xl/8 [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:tracking-tight",
        "[&_.tiptap>h2:not(:first-child)]:mt-8",
        "[&_.tiptap_h3]:text-lg/7 [&_.tiptap_h3]:font-semibold",
        "[&_.tiptap>h3:not(:first-child)]:mt-6",
        "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:ps-6",
        "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:ps-6",
        "[&_.tiptap_li+li]:mt-1",
        "[&_.tiptap_li::marker]:text-muted-foreground",
        "[&_.tiptap_blockquote]:text-muted-foreground [&_.tiptap_blockquote]:border-s-2 [&_.tiptap_blockquote]:ps-4",
        "[&_.tiptap_pre]:bg-muted [&_.tiptap_pre]:rounded-md [&_.tiptap_pre]:px-4 [&_.tiptap_pre]:py-3 [&_.tiptap_pre]:font-mono [&_.tiptap_pre]:text-sm",
        "[&_.tiptap_:not(pre)>code]:bg-muted [&_.tiptap_:not(pre)>code]:rounded-sm [&_.tiptap_:not(pre)>code]:px-1 [&_.tiptap_:not(pre)>code]:py-0.5 [&_.tiptap_:not(pre)>code]:font-mono [&_.tiptap_:not(pre)>code]:text-sm",
        "[&_.tiptap_a]:text-primary [&_.tiptap_a]:underline [&_.tiptap_a]:underline-offset-4",
        "[&_.tiptap_hr]:border-border [&_.tiptap_hr]:my-6",
        "[&_.tiptap_.tableWrapper]:my-6 [&_.tiptap_.tableWrapper]:overflow-x-auto",
        "[&_.tiptap_table]:w-full [&_.tiptap_table]:table-fixed [&_.tiptap_table]:border-collapse [&_.tiptap_table]:text-sm",
        "[&_.tiptap_:is(td,th)]:border-border [&_.tiptap_:is(td,th)]:border [&_.tiptap_:is(td,th)]:px-3 [&_.tiptap_:is(td,th)]:py-2 [&_.tiptap_:is(td,th)]:text-start [&_.tiptap_:is(td,th)]:align-top [&_.tiptap_:is(td,th)]:relative",
        "[&_.tiptap_th]:bg-muted [&_.tiptap_th]:text-muted-foreground [&_.tiptap_th]:font-medium",
        "[&_.tiptap_[data-type=mention]]:bg-primary/10 [&_.tiptap_[data-type=mention]]:text-primary [&_.tiptap_[data-type=mention]]:rounded-sm [&_.tiptap_[data-type=mention]]:px-1 [&_.tiptap_[data-type=mention]]:py-0.5 [&_.tiptap_[data-type=mention]]:font-medium",
        className
      )}
      {...props}
    />
  );
}
