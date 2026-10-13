"use client";

import { cn } from "cn";
import * as React from "react";

import { useRichTextEditorState } from "../hooks/use-editor-state";
import { useRichTextEditor } from "../rich-text-editor-context";

type RichTextEditorBubbleMenuProps = React.ComponentProps<"div">;

/**
 * Floating menu anchored above the current text selection. Positioned
 * with ProseMirror's `coordsAtPos`; no extra positioning dependency.
 * Renders `null` while the selection is empty.
 */
export function RichTextEditorBubbleMenu({
  className,
  children,
  ...props
}: RichTextEditorBubbleMenuProps) {
  const { editor, features, readOnly, disabled } = useRichTextEditor();
  const state = useRichTextEditorState(editor);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{
    left: number;
    top: number;
  } | null>(null);

  const visible =
    features.bubbleMenu &&
    !readOnly &&
    !disabled &&
    editor !== null &&
    !state.isSelectionEmpty;

  React.useLayoutEffect(() => {
    if (!visible || !editor) {
      setPosition(null);
      return;
    }

    const { view } = editor;
    const { from, to } = view.state.selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    // Anchor against the relative-positioned root so the absolute menu
    // lines up no matter where inside <RichTextEditor> it is mounted.
    const parent = view.dom.closest("[data-slot=rich-text-editor]");

    if (!parent) {
      setPosition(null);
      return;
    }

    const parentRect = parent.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 0;

    setPosition({
      left: Math.max(
        8,
        (start.left + end.left) / 2 - parentRect.left - menuWidth / 2
      ),
      top: Math.max(0, start.top - parentRect.top - 8),
    });
  }, [
    editor,
    visible,
    state.selectionFrom,
    state.selectionTo,
    state.isSelectionEmpty,
  ]);

  if (!visible || !position) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      data-slot="rich-text-editor-bubble-menu"
      className={cn(
        "bg-popover text-popover-foreground absolute z-50 flex -translate-y-full items-center gap-0.5 rounded-md border p-1 shadow-md",
        className
      )}
      style={{ left: position.left, top: position.top }}
      {...props}
    >
      {children}
    </div>
  );
}
