import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type YourComponentProps = HTMLAttributes<HTMLDivElement>;

const YourComponent = forwardRef<HTMLDivElement, YourComponentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-4 rounded-md text-center bg-muted/20 space-y-2 border border-muted h-48 flex items-center flex-col justify-center",
        className
      )}
      {...props}
    >
      <p className="text-sm text-muted-foreground/70">
        Replace this placeholder with your custom shadcn component
      </p>
      <p className="text-muted-foreground text-center text-xs">
        Edit{" "}
        <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
          registry-kromm-ui/bases/aria/kromm-ui/your-component.tsx
        </code>{" "}
        to get started
      </p>
    </div>
  )
);

YourComponent.displayName = "YourComponent";

export { YourComponent };
