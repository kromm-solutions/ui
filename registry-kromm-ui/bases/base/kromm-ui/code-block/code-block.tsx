import { cn } from "cn";
import type { CSSProperties } from "react";

import { CodeBlockCollapse } from "./code-block-collapse";
import { CodeBlockCopy } from "./code-block-copy";
import { highlightCodeBlock } from "./highlight";

export interface CodeBlockProps {
  /** Source code to highlight. */
  code: string;
  /** Shiki language id. Unknown ids fall back to plain text. */
  language?: string;
  /** Shown in the header; also becomes the accessible name of the scroll region. */
  filename?: string;
  lineNumbers?: boolean;
  collapsible?: boolean;
  /** Visible height while `collapsible` and collapsed. */
  collapsedHeight?: string;
  className?: string;
}

export async function CodeBlock({
  className,
  code,
  collapsedHeight,
  collapsible = false,
  filename,
  language = "tsx",
  lineNumbers = false,
}: CodeBlockProps) {
  const source = typeof code === "string" ? code : String(code ?? "");
  const label = filename ? `${filename} code` : `${language} code`;

  const highlighted = await highlightCodeBlock(source, language, {
    label,
    lineNumbers,
  });

  // Safe: shiki escapes the source it was given, so this is markup this
  // component built, never caller HTML.
  const viewport = (
    <div
      className={cn(
        "[&_pre]:m-0",
        // Without a header the copy button floats over the first line, so the
        // code keeps a right gutter clear of it.
        !filename && "[&_pre]:pr-12"
      )}
      dangerouslySetInnerHTML={{ __html: highlighted }}
      data-slot="code-block-viewport"
    />
  );

  return (
    <div
      className={cn(
        "bg-[var(--code-block-bg)] relative overflow-hidden rounded-xl border text-foreground",
        className
      )}
      data-slot="code-block"
      style={
        {
          "--code-block-bg": "var(--code, var(--muted))",
        } as CSSProperties
      }
    >
      {filename ? (
        <div
          className="flex items-center justify-between gap-2 border-b py-1 pr-2 pl-4"
          data-slot="code-block-header"
        >
          <span className="text-muted-foreground truncate font-mono text-xs">
            {filename}
          </span>
          <CodeBlockCopy value={source} />
        </div>
      ) : (
        <div className="absolute top-2 right-2 z-10">
          <CodeBlockCopy className="bg-[var(--code-block-bg)]" value={source} />
        </div>
      )}

      {collapsible ? (
        <CodeBlockCollapse collapsedHeight={collapsedHeight}>
          {viewport}
        </CodeBlockCollapse>
      ) : (
        viewport
      )}
    </div>
  );
}
