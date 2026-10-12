"use client";

import * as React from "react";

import {
  RichTextEditor,
  RichTextEditorBlockHandle,
  RichTextEditorBubbleMenu,
  RichTextEditorContent,
  RichTextEditorToolbar,
  RichTextEditorToolbarButton,
  RichTextEditorToolbarGroup,
  RichTextEditorToolbarSeparator,
} from "@/registry-kromm-ui/bases/base/kromm-ui/rich-text-editor";

export function RichTextEditorDefault() {
  return (
    <RichTextEditor
      className="w-full max-w-2xl"
      placeholder="Escribe algo…"
    >
      <RichTextEditorToolbar>
        <RichTextEditorToolbarGroup>
          <RichTextEditorToolbarButton aria-label="Undo" command="undo" />
          <RichTextEditorToolbarButton aria-label="Redo" command="redo" />
        </RichTextEditorToolbarGroup>
        <RichTextEditorToolbarSeparator />
        <RichTextEditorToolbarGroup>
          <RichTextEditorToolbarButton aria-label="Bold" command="bold" />
          <RichTextEditorToolbarButton
            aria-label="Italic"
            command="italic"
          />
          <RichTextEditorToolbarButton
            aria-label="Underline"
            command="underline"
          />
          <RichTextEditorToolbarButton
            aria-label="Strikethrough"
            command="strike"
          />
          <RichTextEditorToolbarButton
            aria-label="Inline code"
            command="code"
          />
        </RichTextEditorToolbarGroup>
        <RichTextEditorToolbarSeparator />
        <RichTextEditorToolbarGroup>
          <RichTextEditorToolbarButton
            aria-label="Heading 1"
            command="heading1"
          />
          <RichTextEditorToolbarButton
            aria-label="Heading 2"
            command="heading2"
          />
          <RichTextEditorToolbarButton
            aria-label="Heading 3"
            command="heading3"
          />
        </RichTextEditorToolbarGroup>
        <RichTextEditorToolbarSeparator />
        <RichTextEditorToolbarGroup>
          <RichTextEditorToolbarButton
            aria-label="Bullet list"
            command="bulletList"
          />
          <RichTextEditorToolbarButton
            aria-label="Ordered list"
            command="orderedList"
          />
          <RichTextEditorToolbarButton
            aria-label="Task list"
            command="taskList"
          />
          <RichTextEditorToolbarButton
            aria-label="Blockquote"
            command="blockquote"
          />
          <RichTextEditorToolbarButton
            aria-label="Code block"
            command="codeBlock"
          />
        </RichTextEditorToolbarGroup>
        <RichTextEditorToolbarSeparator />
        <RichTextEditorToolbarGroup>
          <RichTextEditorToolbarButton
            aria-label="Insert table"
            command="insertTable"
          />
          <RichTextEditorToolbarButton
            aria-label="Horizontal rule"
            command="horizontalRule"
          />
        </RichTextEditorToolbarGroup>
      </RichTextEditorToolbar>
      <RichTextEditorBubbleMenu>
        <RichTextEditorToolbarButton aria-label="Bold" command="bold" />
        <RichTextEditorToolbarButton aria-label="Italic" command="italic" />
        <RichTextEditorToolbarButton
          aria-label="Underline"
          command="underline"
        />
        <RichTextEditorToolbarButton
          aria-label="Strikethrough"
          command="strike"
        />
      </RichTextEditorBubbleMenu>
      <RichTextEditorContent />
      <RichTextEditorBlockHandle />
    </RichTextEditor>
  );
}
