"use client";

import { cn } from "cn";
import { GripVertical, Plus } from "lucide-react";
import * as React from "react";

import { useRichTextEditorState } from "../hooks/use-editor-state";
import { useRichTextEditor } from "../rich-text-editor-context";

type RichTextEditorBlockHandleProps = React.ComponentProps<"div">;

/**
 * Per-block handle floating at the start of the hovered block: a "+"
 * button inserts a paragraph below and the grip sets the selection to
 * that block so drag-and-drop extensions can take over.
 */
export function RichTextEditorBlockHandle({
  className,
  ...props
}: RichTextEditorBlockHandleProps) {
  const { editor, features, readOnly, disabled } = useRichTextEditor();
  useRichTextEditorState(editor); // keep aligned with doc/selection changes
  const [position, setPosition] = React.useState<{
    left: number;
    nodePos: number;
    top: number;
  } | null>(null);

  React.useEffect(() => {
    if (
      !editor ||
      !features.blockHandle ||
      readOnly ||
      disabled
    ) {
      return;
    }

    const dom = editor.view.dom;

    const handleMouseMove = (event: MouseEvent) => {
      const pos = editor.view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      if (!pos) {
        setPosition(null);
        return;
      }

      // Resolve the top-level block under the pointer.
      const $pos = editor.state.doc.resolve(pos.pos);
      const nodePos = $pos.depth > 0 ? $pos.before(1) : pos.pos;
      const coords = editor.view.coordsAtPos(nodePos);
      const root = dom.closest("[data-slot=rich-text-editor]");

      if (!root) {
        setPosition(null);
        return;
      }

      const rootRect = root.getBoundingClientRect();
      setPosition({
        left: 4,
        nodePos,
        top: coords.top - rootRect.top,
      });
    };

    const handleMouseLeave = () => setPosition(null);

    dom.addEventListener("mousemove", handleMouseMove);
    dom.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      dom.removeEventListener("mousemove", handleMouseMove);
      dom.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled, editor, features.blockHandle, readOnly]);

  if (!editor || !features.blockHandle || readOnly || disabled || !position) {
    return null;
  }

  const insertBelow = () => {
    editor
      .chain()
      .focus()
      .insertContentAt(position.nodePos + 1, { type: "paragraph" })
      .run();
  };

  const selectBlock = () => {
    editor.commands.setNodeSelection(position.nodePos);
  };

  return (
    <div
      data-slot="rich-text-editor-block-handle"
      className={cn("absolute z-10 flex items-center gap-0.5", className)}
      style={{ left: position.left, top: position.top }}
      {...props}
    >
      <button
        aria-label="Insert block below"
        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex size-6 items-center justify-center rounded-md"
        onClick={insertBelow}
        type="button"
      >
        <Plus className="size-4" />
      </button>
      <button
        aria-label="Select block"
        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex size-6 cursor-grab items-center justify-center rounded-md active:cursor-grabbing"
        onClick={selectBlock}
        type="button"
      >
        <GripVertical className="size-4" />
      </button>
    </div>
  );
}
