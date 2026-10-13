"use client";

import * as React from "react";

import type {
  RichTextMentionItem,
  RichTextValue,
} from "@/registry-kromm-ui/bases/base/kromm-ui/rich-text-editor";
import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorToolbar,
  RichTextEditorToolbarButton,
  RichTextEditorToolbarGroup,
  RichTextEditorToolbarSeparator,
  useRichTextEditor,
} from "@/registry-kromm-ui/bases/base/kromm-ui/rich-text-editor";

const initialDocument: NonNullable<RichTextValue> = {
  content: [
    {
      attrs: { level: 1 },
      content: [{ text: "Escalation Playbook", type: "text" }],
      type: "heading",
    },
    {
      content: [
        {
          text: "How support hands a problem to engineering. Owned by ",
          type: "text",
        },
        {
          attrs: { id: "usr_daniel", label: "Daniel Okafor" },
          type: "mention",
        },
        { text: ".", type: "text" },
      ],
      type: "paragraph",
    },
    {
      attrs: { level: 2 },
      content: [{ text: "When to Escalate", type: "text" }],
      type: "heading",
    },
    {
      content: [
        {
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Tag the ticket with its tier" }],
            },
          ],
          type: "taskItem",
        },
        {
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Paste the search diagnostics" }],
            },
          ],
          type: "taskItem",
        },
      ],
      type: "taskList",
    },
    { type: "horizontalRule" },
  ],
  type: "doc",
};

const mentionSource = (query: string): RichTextMentionItem[] => {
  const people: RichTextMentionItem[] = [
    { id: "usr_daniel", label: "Daniel Okafor" },
    { id: "usr_lena", label: "Lena Hoffmann" },
    { id: "usr_maya", label: "Maya Chen" },
    { id: "usr_arjun", label: "Arjun Mehta" },
  ];
  const q = query.toLowerCase();
  return people.filter((person) => person.label.toLowerCase().includes(q));
};

function HighlightControls() {
  const { editor } = useRichTextEditor();
  if (!editor) {
    return null;
  }
  return (
    <RichTextEditorToolbarGroup>
      {(["yellow", "green", "blue", "pink", "violet"] as const).map((color) => (
        <button
          aria-label={`Highlight ${color}`}
          className="size-6 rounded-full border"
          key={color}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color }).run()
          }
          style={{ background: `var(--highlight-${color})` }}
          type="button"
        />
      ))}
      <RichTextEditorToolbarButton
        aria-label="Remove highlight"
        command="unsetHighlights"
      />
    </RichTextEditorToolbarGroup>
  );
}

export function RichTextEditorFull() {
  const [doc, setDoc] = React.useState<RichTextValue>(initialDocument);
  return (
    <div className="w-full max-w-2xl space-y-3">
      <RichTextEditor
        ariaLabel="Playbook page"
        mentionItems={mentionSource}
        onValueChange={setDoc}
        value={doc}
      >
        <RichTextEditorToolbar>
          <RichTextEditorToolbarGroup>
            <RichTextEditorToolbarButton aria-label="Undo" command="undo" />
            <RichTextEditorToolbarButton aria-label="Redo" command="redo" />
          </RichTextEditorToolbarGroup>
          <RichTextEditorToolbarSeparator />
          <RichTextEditorToolbarGroup>
            <RichTextEditorToolbarButton aria-label="Bold" command="bold" />
            <RichTextEditorToolbarButton aria-label="Italic" command="italic" />
            <RichTextEditorToolbarButton
              aria-label="Heading 2"
              command="heading2"
            />
          </RichTextEditorToolbarGroup>
          <RichTextEditorToolbarSeparator />
          <HighlightControls />
        </RichTextEditorToolbar>
        <RichTextEditorContent />
      </RichTextEditor>
      <p className="text-muted-foreground text-xs">
        Controlled: {doc ? JSON.stringify(doc).length : 0} bytes of JSON.
      </p>
    </div>
  );
}
