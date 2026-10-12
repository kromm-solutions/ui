"use client";

import { cn } from "cn";
import * as React from "react";

export function YourComponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md border bg-background p-4 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      This is a template component. Replace it with your own component.
    </div>
  );
}
