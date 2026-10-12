"use client";

import { cn } from "cn";
import * as React from "react";

import { Button } from "@/registry/bases/base/ui/button";

export function CodeBlockCollapse({
  children,
  className,
  collapsedHeight = "16rem",
}: {
  children: React.ReactNode;
  className?: string;
  collapsedHeight?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  return (
    <div
      className={cn("relative", className)}
      data-slot="code-block-collapse"
      data-state={open ? "open" : "closed"}
    >
      <div
        className={cn(
          "overflow-hidden",
          open ? "max-h-none" : "max-h-[var(--code-block-collapsed-height)]"
        )}
        id={contentId}
        style={
          {
            "--code-block-collapsed-height": collapsedHeight,
          } as React.CSSProperties
        }
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "from-[var(--code-block-bg)] pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent",
          open && "hidden"
        )}
      />

      <div className="flex justify-center border-t py-1.5">
        <Button
          aria-controls={contentId}
          aria-expanded={open}
          className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
          onClick={() => setOpen((value) => !value)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {open ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
}
