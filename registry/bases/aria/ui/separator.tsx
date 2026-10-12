"use client";

import { cn } from "cn";
import { Separator as AriaSeparator } from "react-aria-components";
import type { SeparatorProps as AriaSeparatorProps } from "react-aria-components";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: AriaSeparatorProps) {
  return (
    <AriaSeparator
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
