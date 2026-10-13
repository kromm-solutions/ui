"use client";

import { cn } from "cn";
import {
  Bold,
  Code,
  CodeSquare,
  Highlighter,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  TextQuote,
  Underline,
  Undo2,
} from "lucide-react";
import * as React from "react";

import type { RichTextCommand } from "../core/types";
import type { RichTextEditorState } from "../hooks/use-editor-state";
import { useRichTextEditorState } from "../hooks/use-editor-state";
import { useRichTextEditor } from "../rich-text-editor-context";

type RichTextEditorToolbarProps = React.ComponentProps<"div">;

export function RichTextEditorToolbar({
  className,
  ...props
}: RichTextEditorToolbarProps) {
  const { disabled, readOnly } = useRichTextEditor();

  return (
    <div
      aria-disabled={disabled || readOnly || undefined}
      data-slot="rich-text-editor-toolbar"
      role="toolbar"
      aria-label="Text formatting"
      aria-orientation="horizontal"
      className={cn(
        "flex flex-wrap items-center gap-0.5 border-b bg-card/60 px-2 py-1.5",
        className
      )}
      {...props}
    />
  );
}

export function RichTextEditorToolbarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { disabled, readOnly } = useRichTextEditor();

  return (
    <div
      data-slot="rich-text-editor-toolbar-group"
      role="group"
      aria-disabled={disabled || readOnly || undefined}
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

export function RichTextEditorToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="rich-text-editor-toolbar-separator"
      role="separator"
      className={cn("bg-border mx-1 h-5 w-px shrink-0", className)}
      {...props}
    />
  );
}

type ToolbarButtonBase = Omit<React.ComponentProps<"button">, "onClick">;

export interface RichTextEditorToolbarButtonProps extends ToolbarButtonBase {
  /** Command name or a custom chain runner. */
  command?: RichTextCommand;
  /** Optional custom runner; receives the editor. */
  run?: (
    editor: NonNullable<ReturnType<typeof useRichTextEditor>["editor"]>
  ) => void;
  /** Override the active state (defaults to the command's state). */
  active?: boolean;
  /** Override disabled. */
  disabled?: boolean;
  "aria-label": string;
}

const COMMAND_ICONS: Record<
  RichTextCommand,
  React.ComponentType<{ className?: string }>
> = {
  blockquote: TextQuote,
  bold: Bold,
  bulletList: List,
  code: Code,
  codeBlock: CodeSquare,
  heading1: () => <span className="text-xs font-semibold">H1</span>,
  heading2: () => <span className="text-xs font-semibold">H2</span>,
  heading3: () => <span className="text-xs font-semibold">H3</span>,
  horizontalRule: Minus,
  insertTable: TableIcon,
  italic: Italic,
  orderedList: ListOrdered,
  redo: Redo2,
  strike: Strikethrough,
  taskList: ListChecks,
  underline: Underline,
  undo: Undo2,
  unsetHighlights: Highlighter,
};

export function RichTextEditorToolbarButton({
  active,
  "aria-label": ariaLabel,
  className,
  command,
  disabled,
  run,
  ...props
}: RichTextEditorToolbarButtonProps) {
  const {
    editor,
    disabled: contextDisabled,
    readOnly,
    features,
  } = useRichTextEditor();
  const state = useRichTextEditorState(editor);

  const commandStateKey = command ? COMMAND_STATE_KEYS[command] : null;
  const isActive = active ?? (commandStateKey ? state[commandStateKey] : false);
  const baseDisabled = disabled ?? (contextDisabled || readOnly);
  const isDisabled =
    command === "undo"
      ? baseDisabled || !state.canUndo
      : command === "redo"
        ? baseDisabled || !state.canRedo
        : baseDisabled;

  const Icon = command ? COMMAND_ICONS[command] : null;

  const handleClick = React.useCallback(() => {
    if (!editor) {
      return;
    }

    if (run) {
      run(editor);
      return;
    }

    if (command) {
      runCommand(editor, command);
    }
  }, [command, editor, run]);

  // Hide feature-scoped buttons when the feature is disabled.
  if (command === "taskList" && !features.tasks) {
    return null;
  }
  if (command === "insertTable" && !features.tables) {
    return null;
  }

  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-pressed:bg-accent aria-pressed:text-accent-foreground",
        className
      )}
      data-active={isActive || undefined}
      data-disabled={isDisabled || undefined}
      data-slot="rich-text-editor-toolbar-button"
      disabled={isDisabled}
      onClick={handleClick}
      type="button"
    >
      {props.children ?? (Icon ? <Icon className="size-4" /> : null)}
    </button>
  );
}

type ToolbarStateKey = {
  [K in keyof RichTextEditorState]: RichTextEditorState[K] extends boolean
    ? K
    : never;
}[keyof RichTextEditorState];

/** Commands with an `aria-pressed` state; the rest are plain actions. */
const COMMAND_STATE_KEYS: Partial<Record<RichTextCommand, ToolbarStateKey>> = {
  blockquote: "blockquote",
  bold: "bold",
  bulletList: "bulletList",
  code: "code",
  codeBlock: "codeBlock",
  heading1: "heading1",
  heading2: "heading2",
  heading3: "heading3",
  italic: "italic",
  orderedList: "orderedList",
  strike: "strike",
  taskList: "taskList",
  underline: "underline",
};

function runCommand(
  editor: NonNullable<ReturnType<typeof useRichTextEditor>["editor"]>,
  command: RichTextCommand
) {
  const chain = editor.chain().focus();

  switch (command) {
    case "blockquote": {
      chain.toggleBlockquote().run();
      break;
    }
    case "bold": {
      chain.toggleBold().run();
      break;
    }
    case "bulletList": {
      chain.toggleBulletList().run();
      break;
    }
    case "code": {
      chain.toggleCode().run();
      break;
    }
    case "codeBlock": {
      chain.toggleCodeBlock().run();
      break;
    }
    case "heading1": {
      chain.toggleHeading({ level: 1 }).run();
      break;
    }
    case "heading2": {
      chain.toggleHeading({ level: 2 }).run();
      break;
    }
    case "heading3": {
      chain.toggleHeading({ level: 3 }).run();
      break;
    }
    case "horizontalRule": {
      chain.setHorizontalRule().run();
      break;
    }
    case "insertTable": {
      editor
        .chain()
        .focus()
        .insertTable({ cols: 3, rows: 3, withHeaderRow: true })
        .run();
      break;
    }
    case "italic": {
      chain.toggleItalic().run();
      break;
    }
    case "orderedList": {
      chain.toggleOrderedList().run();
      break;
    }
    case "redo": {
      chain.redo().run();
      break;
    }
    case "strike": {
      chain.toggleStrike().run();
      break;
    }
    case "taskList": {
      chain.toggleTaskList().run();
      break;
    }
    case "underline": {
      chain.toggleUnderline().run();
      break;
    }
    case "undo": {
      chain.undo().run();
      break;
    }
    case "unsetHighlights": {
      chain.unsetHighlight().run();
      break;
    }
    default: {
      break;
    }
  }
}
