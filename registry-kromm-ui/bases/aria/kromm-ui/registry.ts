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
  path: `registry-kromm-ui/bases/aria/kromm-ui/rich-text-editor/${file}`,
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
  "signature-pad-actions.tsx",
].map((file) => ({
  path: `registry-kromm-ui/bases/aria/kromm-ui/signature-pad/${file}`,
  target: `@ui/signature-pad/${file}`,
  type: "registry:ui" as const,
}));

export const ui: Registry["items"] = [
  {
    files: [
      {
        path: "registry-kromm-ui/bases/aria/kromm-ui/your-component.tsx",
        type: "registry:ui",
      },
    ],
    name: "your-component",
    title: "Your Component",
    type: "registry:ui",
  },
  {
    description: "Create a canvas for users to draw signatures.",
    files: signaturePadFiles,
    name: "signature-pad",
    registryDependencies: ["button"],
    title: "Signature Pad",
    type: "registry:ui",
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
    css: {
      "@layer components": {
        "[data-slot=rich-text-editor-content] .ProseMirror-selectednode": {
          "border-radius": "var(--radius-sm)",
          outline:
            "2px solid color-mix(in oklch, var(--ring) 50%, transparent)",
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
        "[data-slot=rich-text-editor-content] .is-empty::before": {
          color: "var(--muted-foreground)",
          content: "attr(data-placeholder)",
          float: "inline-start",
          height: "0",
          "pointer-events": "none",
        },
        "[data-slot=rich-text-editor-content] .selectedCell::after": {
          background: "color-mix(in oklch, var(--primary) 10%, transparent)",
          content: "''",
          inset: "0",
          "pointer-events": "none",
          position: "absolute",
        },
        "[data-slot=rich-text-editor-content] .tableWrapper.resize-cursor": {
          cursor: "col-resize",
        },
        "[data-slot=rich-text-editor-content] ::selection": {
          background: "color-mix(in oklch, var(--primary) 15%, transparent)",
        },
        "[data-slot=rich-text-editor-content] li[data-checked=true] > div": {
          color: "var(--muted-foreground)",
          "text-decoration": "line-through",
        },
        "[data-slot=rich-text-editor-content] ul[data-type=taskList]": {
          "list-style": "none",
          "padding-inline-start": "0.5rem",
        },
        "[data-slot=rich-text-editor]": {
          "--highlight-blue":
            "light-dark(color-mix(in oklch, var(--chart-1) 35%, white 50%), color-mix(in oklch, var(--chart-1) 30%, transparent))",
          "--highlight-green":
            "light-dark(color-mix(in oklch, var(--chart-2) 35%, white 50%), color-mix(in oklch, var(--chart-2) 30%, transparent))",
          "--highlight-pink":
            "light-dark(color-mix(in oklch, var(--chart-3) 35%, white 50%), color-mix(in oklch, var(--chart-3) 30%, transparent))",
          "--highlight-violet":
            "light-dark(color-mix(in oklch, var(--chart-5) 35%, white 50%), color-mix(in oklch, var(--chart-5) 30%, transparent))",
          "--highlight-yellow":
            "light-dark(color-mix(in oklch, var(--chart-4) 35%, white 50%), color-mix(in oklch, var(--chart-4) 30%, transparent))",
        },
        "[data-slot=rich-text-editor] mark": {
          background: "var(--highlight-yellow)",
          "border-radius": "var(--radius-sm)",
          color: "inherit",
          padding: "0.125rem 0.25rem",
        },
        "[data-slot=rich-text-editor] mark[data-color=blue]": {
          background: "var(--highlight-blue)",
        },
        "[data-slot=rich-text-editor] mark[data-color=green]": {
          background: "var(--highlight-green)",
        },
        "[data-slot=rich-text-editor] mark[data-color=pink]": {
          background: "var(--highlight-pink)",
        },
        "[data-slot=rich-text-editor] mark[data-color=violet]": {
          background: "var(--highlight-violet)",
        },
      },
    },
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
    description:
      "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights.",
    files: richTextEditorFiles,
    name: "rich-text-editor",
    title: "Rich Text Editor",
    type: "registry:ui",
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
