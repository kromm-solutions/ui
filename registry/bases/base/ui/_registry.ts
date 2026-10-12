import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [{ path: "ui/button.tsx", type: "registry:ui" }],
    name: "button",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [{ path: "ui/separator.tsx", type: "registry:ui" }],
    name: "separator",
    type: "registry:ui",
  },
  {
    files: [{ path: "ui/card.tsx", type: "registry:ui" }],
    name: "card",
    type: "registry:ui",
  },
  {
    dependencies: ["class-variance-authority"],
    files: [{ path: "ui/badge.tsx", type: "registry:ui" }],
    name: "badge",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [{ path: "ui/input.tsx", type: "registry:ui" }],
    name: "input",
    type: "registry:ui",
  },
  {
    files: [{ path: "ui/skeleton.tsx", type: "registry:ui" }],
    name: "skeleton",
    type: "registry:ui",
  },
  {
    files: [{ path: "ui/kbd.tsx", type: "registry:ui" }],
    name: "kbd",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [{ path: "ui/tabs.tsx", type: "registry:ui" }],
    name: "tabs",
    type: "registry:ui",
  },
  {
    dependencies: ["class-variance-authority"],
    files: [{ path: "ui/field.tsx", type: "registry:ui" }],
    name: "field",
    type: "registry:ui",
  },
  {
    files: [{ path: "ui/label.tsx", type: "registry:ui" }],
    name: "label",
    type: "registry:ui",
  },
  {
    files: [{ path: "ui/native-select.tsx", type: "registry:ui" }],
    name: "native-select",
    type: "registry:ui",
  },
];
