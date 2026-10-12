import type { Registry } from "shadcn/schema";

const richTextEditorFiles = [
  "index.ts",
  "rich-text-editor.tsx",
  "rich-text-editor-content.tsx",
  "rich-text-editor-context.tsx",
  "core/types.ts",
  "core/extensions.ts",
  "core/serialization.ts",
  "core/marks.ts",
  "hooks/use-rich-text-editor.ts",
  "hooks/use-editor-state.ts",
  "components/rich-text-editor-toolbar.tsx",
  "components/rich-text-editor-bubble-menu.tsx",
  "components/rich-text-editor-block-handle.tsx",
].map((file) => ({
  path: `registry-kromm-ui/bases/base/kromm-ui/rich-text-editor/${file}`,
  target: `@ui/rich-text-editor/${file}`,
  type: "registry:ui" as const,
}));


const signaturePadFiles = [
  "index.ts",
  "signature-pad.tsx",
  "signature-pad-canvas.tsx",
  "signature-pad-context.tsx",
  "core/types.ts",
  "core/geometry.ts",
  "core/history.ts",
  "core/serialization.ts",
  "hooks/use-signature-history.ts",
  "components/signature-pad-actions.tsx",
  "lib/index.ts",
  "blocks/signature-pad-form-block.tsx",
].map((file) => ({
  path: `registry-kromm-ui/bases/base/kromm-ui/signature-pad/${file}`,
  target: `@ui/signature-pad/${file}`,
  type: "registry:ui" as const,
}));

export const ui: Registry["items"] = [
  {
    files: [
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/your-component.tsx",
        type: "registry:ui",
      },
    ],
    name: "your-component",
    title: "Your Component",
    type: "registry:ui",
  },
  {
    name: "signature-pad",
    title: "Signature Pad",
    description: "Create a canvas for users to draw signatures.",
    type: "registry:ui",
    registryDependencies: ["button"],
    files: signaturePadFiles,
  },
  {
    dependencies: ["motion"],
    description:
      "A text flipper with customizable flip animations and interval timing.",
    files: [
      {
        path: "registry-kromm-ui/bases/shared/ui/text-flip.tsx",
        type: "registry:ui",
      },
    ],
    name: "text-flip",
    title: "Text Flip",
    type: "registry:ui",
  },
  {
    description:
      "Responsive laptop frame mockup with customizable chassis variants.",
    files: [
      {
        path: "registry-kromm-ui/bases/shared/ui/laptop-mockup.tsx",
        type: "registry:ui",
      },
    ],
    name: "laptop-mockup",
    title: "Laptop Mockup",
    type: "registry:ui",
  },
  {
    description:
      "Responsive smartphone frame mockup with dynamic island and chassis variants.",
    files: [
      {
        path: "registry-kromm-ui/bases/shared/ui/phone-mockup.tsx",
        type: "registry:ui",
      },
    ],
    name: "phone-mockup",
    title: "Phone Mockup",
    type: "registry:ui",
  },
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Shiki-highlighted code with a filename header, copy button and optional line numbers or collapse.",
    type: "registry:ui",
    dependencies: ["shiki", "lucide-react"],
    // Every file the component imports is listed. Shipping only the barrel
    // would install a relative import pointing at a file that never landed.
    // Targets keep the sibling imports together in one folder.
    files: [
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/code-block/index.ts",
        target: "@ui/code-block/index.ts",
        type: "registry:ui",
      },
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/code-block/code-block.tsx",
        target: "@ui/code-block/code-block.tsx",
        type: "registry:ui",
      },
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/code-block/code-block-copy.tsx",
        target: "@ui/code-block/code-block-copy.tsx",
        type: "registry:ui",
      },
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/code-block/code-block-collapse.tsx",
        target: "@ui/code-block/code-block-collapse.tsx",
        type: "registry:ui",
      },
      {
        path: "registry-kromm-ui/bases/base/kromm-ui/code-block/highlight.ts",
        target: "@ui/code-block/highlight.ts",
        type: "registry:ui",
      },
    ],
    // Shiki emits both themes as variables on every token; without these rules
    // the dark values are never applied. Scoped to the component so installing
    // the item cannot restyle a consumer's own code blocks.
    css: {
      "@layer components": {
        ".dark [data-slot=code-block] [data-line] span": {
          color: "var(--shiki-dark)",
        },
        "[data-slot=code-block] [data-line-numbers]": {
          "--shiki-dark": "transparent",
          "counter-reset": "line",
          display: "grid",
        },
        "[data-slot=code-block] [data-line-numbers] [data-line]::before": {
          color: "var(--code-number, var(--muted-foreground))",
          content: "counter(line)",
          "counter-increment": "line",
          display: "inline-block",
          "padding-right": "1rem",
          "text-align": "right",
          width: "2rem",
        },
        "[data-slot=code-block] [data-line]": {
          display: "inline-block",
          width: "100%",
        },
        "[data-slot=code-block] [data-line] span": {
          color: "var(--shiki-light)",
        },
      },
    },
  },
  {
    name: "rich-text-editor",
    title: "Rich Text Editor",
    description:
      "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights.",
    type: "registry:ui",
    dependencies: [
      "@tiptap/core",
      "@tiptap/react",
      "@tiptap/pm",
      "@tiptap/starter-kit",
      "@tiptap/extensions",
      "@tiptap/extension-highlight",
      "@tiptap/extension-mention",
      "@tiptap/extension-table",
      "@tiptap/extension-task-item",
      "@tiptap/extension-task-list",
      "lucide-react",
    ],
    files: richTextEditorFiles,
    css: {
      "@layer components": {
        // Highlight colors are theme tokens, never hardcoded palette
        // classes, so every shadcn theme can restyle marks.
        "[data-slot=rich-text-editor]": {
          "--highlight-yellow":
            "light-dark(color-mix(in oklch, var(--chart-4) 35%, white 50%), color-mix(in oklch, var(--chart-4) 30%, transparent))",
          "--highlight-green":
            "light-dark(color-mix(in oklch, var(--chart-2) 35%, white 50%), color-mix(in oklch, var(--chart-2) 30%, transparent))",
          "--highlight-blue":
            "light-dark(color-mix(in oklch, var(--chart-1) 35%, white 50%), color-mix(in oklch, var(--chart-1) 30%, transparent))",
          "--highlight-pink":
            "light-dark(color-mix(in oklch, var(--chart-3) 35%, white 50%), color-mix(in oklch, var(--chart-3) 30%, transparent))",
          "--highlight-violet":
            "light-dark(color-mix(in oklch, var(--chart-5) 35%, white 50%), color-mix(in oklch, var(--chart-5) 30%, transparent))",
        },
        "[data-slot=rich-text-editor] mark": {
          background: "var(--highlight-yellow)",
          "border-radius": "var(--radius-sm)",
          color: "inherit",
          padding: "0.125rem 0.25rem",
        },
        "[data-slot=rich-text-editor] mark[data-color=green]": {
          background: "var(--highlight-green)",
        },
        "[data-slot=rich-text-editor] mark[data-color=blue]": {
          background: "var(--highlight-blue)",
        },
        "[data-slot=rich-text-editor] mark[data-color=pink]": {
          background: "var(--highlight-pink)",
        },
        "[data-slot=rich-text-editor] mark[data-color=violet]": {
          background: "var(--highlight-violet)",
        },
        // Placeholder on empty nodes (Placeholder extension attributes).
        "[data-slot=rich-text-editor-content] .is-empty::before": {
          color: "var(--muted-foreground)",
          content: "attr(data-placeholder)",
          float: "inline-start",
          height: "0",
          "pointer-events": "none",
        },
        // Task lists render without bullets; checked items strike out.
        "[data-slot=rich-text-editor-content] ul[data-type=taskList]": {
          "list-style": "none",
          "padding-inline-start": "0.5rem",
        },
        "[data-slot=rich-text-editor-content] li[data-checked=true] > div": {
          color: "var(--muted-foreground)",
          "text-decoration": "line-through",
        },
        // Selection + node selection follow the ring/primary tokens.
        "[data-slot=rich-text-editor-content] ::selection": {
          background:
            "color-mix(in oklch, var(--primary) 15%, transparent)",
        },
        "[data-slot=rich-text-editor-content] .ProseMirror-selectednode": {
          outline:
            "2px solid color-mix(in oklch, var(--ring) 50%, transparent)",
          "border-radius": "var(--radius-sm)",
        },
        "[data-slot=rich-text-editor-content] .selectedCell::after": {
          background:
            "color-mix(in oklch, var(--primary) 10%, transparent)",
          content: "''",
          inset: "0",
          "pointer-events": "none",
          position: "absolute",
        },
        "[data-slot=rich-text-editor-content] .column-resize-handle": {
          background: "var(--primary)",
          bottom: "0",
          "inset-inline-end": "-2px",
          "pointer-events": "none",
          position: "absolute",
          top: "0",
          width: "2px",
          "z-index": "20",
        },
        "[data-slot=rich-text-editor-content] .tableWrapper.resize-cursor": {
          cursor: "col-resize",
        },
      },
    },
  },
];

export const hooks: Registry["items"] = [
  {
    files: [
      {
        path: "registry-kromm-ui/bases/shared/hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
      },
    ],
    name: "use-copy-to-clipboard",
    title: "useCopyToClipboard",
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "registry-kromm-ui/bases/shared/hooks/use-scroll-position.ts",
        type: "registry:hook",
      },
    ],
    name: "use-scroll-position",
    title: "useScrollPosition",
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "registry-kromm-ui/bases/shared/hooks/use-slider-input.ts",
        type: "registry:hook",
      },
    ],
    name: "use-slider-input",
    title: "useSliderInput",
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "registry-kromm-ui/bases/shared/hooks/use-file-upload.ts",
        type: "registry:hook",
      },
    ],
    name: "use-file-upload",
    title: "useFileUpload",
    type: "registry:hook",
  },
];
