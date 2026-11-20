// Import dinámico para evitar problemas con Node.js
// Usamos datos estáticos para los patrones
const galleryPatterns = [
  {
    Component: null,
    description: "Patron compuesto con SignaturePad + acciones absolutas",
    id: "signature-pad-form",
    title: "Signature Pad Form",
  },
];

interface MetaEntry {
  description: string;
  name: string;
  order: number;
  title: string;
}
interface CatalogComponent {
  base: string;
  description: string;
  name: string;
  patterns: MetaEntry[];
  title: string;
}

// Datos estáticos de componentes basados en el registry-kromm-ui
const STATIC_COMPONENTS: Record<string, CatalogComponent[]> = {
  aria: [
    {
      base: "aria",
      description:
        "Canvas for users to draw signatures with undo/redo functionality",
      name: "Signature Pad",
      patterns: [
        {
          description:
            "Canvas for users to draw signatures with undo/redo functionality",
          name: "signature-pad",
          order: 0,
          title: "Signature Pad",
        },
      ],
      title: "signature-pad",
    },
    {
      base: "aria",
      description:
        "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
      name: "Rich Text Editor",
      patterns: [
        {
          description:
            "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
          name: "rich-text-editor",
          order: 0,
          title: "Rich Text Editor",
        },
      ],
      title: "rich-text-editor",
    },
  ],
  base: [
    {
      base: "base",
      description:
        "Responsive laptop frame mockup with customizable chassis variants",
      name: "Laptop Mockup",
      patterns: [
        {
          description:
            "Responsive laptop frame mockup with customizable chassis variants",
          name: "laptop-mockup",
          order: 0,
          title: "Laptop Mockup",
        },
      ],
      title: "laptop-mockup",
    },
    {
      base: "base",
      description:
        "Responsive smartphone frame mockup with dynamic island and chassis variants",
      name: "Phone Mockup",
      patterns: [
        {
          description:
            "Responsive smartphone frame mockup with dynamic island and chassis variants",
          name: "phone-mockup",
          order: 0,
          title: "Phone Mockup",
        },
      ],
      title: "phone-mockup",
    },
    {
      base: "base",
      description: "Shiki code block with copy and collapse functionality",
      name: "Code Block",
      patterns: [
        {
          description: "Shiki code block with copy and collapse functionality",
          name: "code-block",
          order: 0,
          title: "Code Block",
        },
      ],
      title: "code-block",
    },
    {
      base: "base",
      description:
        "A text flipper with customizable flip animations and interval timing",
      name: "Text Flip",
      patterns: [
        {
          description:
            "A text flipper with customizable flip animations and interval timing",
          name: "text-flip",
          order: 0,
          title: "Text Flip",
        },
      ],
      title: "text-flip",
    },
    {
      base: "base",
      description:
        "Canvas for users to draw signatures with undo/redo functionality",
      name: "Signature Pad",
      patterns: [
        {
          description:
            "Canvas for users to draw signatures with undo/redo functionality",
          name: "signature-pad",
          order: 0,
          title: "Signature Pad",
        },
      ],
      title: "signature-pad",
    },
    {
      base: "base",
      description:
        "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
      name: "Rich Text Editor",
      patterns: [
        {
          description:
            "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
          name: "rich-text-editor",
          order: 0,
          title: "Rich Text Editor",
        },
      ],
      title: "rich-text-editor",
    },
  ],
  radix: [
    {
      base: "radix",
      description: "Toast notifications component",
      name: "Sonner",
      patterns: [
        {
          description: "Toast notifications component",
          name: "sonner",
          order: 0,
          title: "Sonner",
        },
      ],
      title: "sonner",
    },
    {
      base: "radix",
      description: "Shiki code block with copy and collapse functionality",
      name: "Code Block",
      patterns: [
        {
          description: "Shiki code block with copy and collapse functionality",
          name: "code-block",
          order: 0,
          title: "Code Block",
        },
      ],
      title: "code-block",
    },
    {
      base: "radix",
      description:
        "Canvas for users to draw signatures with undo/redo functionality",
      name: "Signature Pad",
      patterns: [
        {
          description:
            "Canvas for users to draw signatures with undo/redo functionality",
          name: "signature-pad",
          order: 0,
          title: "Signature Pad",
        },
      ],
      title: "signature-pad",
    },
    {
      base: "radix",
      description:
        "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
      name: "Rich Text Editor",
      patterns: [
        {
          description:
            "Headless Tiptap editor with toolbar, bubble menu, task lists, tables, mentions and token-mapped highlights",
          name: "rich-text-editor",
          order: 0,
          title: "Rich Text Editor",
        },
      ],
      title: "rich-text-editor",
    },
  ],
};

// Convertir patrones de gallery a MetaEntry
const convertPatternsToMeta = (): MetaEntry[] =>
  galleryPatterns.map((pattern, index) => ({
    description: pattern.description,
    name: pattern.id,
    order: index,
    title: pattern.title,
  }));

export const getCatalog = (): CatalogComponent[] => {
  const items: CatalogComponent[] = [];

  // Anadir componentes de cada base
  for (const base of ["base", "aria", "radix"] as const) {
    const components = STATIC_COMPONENTS[base] || [];
    items.push(...components);
  }

  // Anadir patrones como una base especial
  const patterns = convertPatternsToMeta();
  if (patterns.length > 0) {
    items.push({
      base: "patterns",
      description: "Custom patterns and compositions",
      name: "Patterns",
      patterns,
      title: "patterns",
    });
  }

  return items;
};

export const getComponent = (
  base: string,
  title: string
): CatalogComponent | undefined =>
  getCatalog().find((c) => c.base === base && c.title === title);

// Funcion para obtener solo los patrones
export const getPatterns = (): MetaEntry[] => convertPatternsToMeta();
