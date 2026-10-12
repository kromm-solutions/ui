import type { ReactNode } from "react";

import { ComponentSource } from "@/components/docs/component-source";
import { cn } from "@/lib/utils";

export const ComponentPreview = ({
  name,
  src,
  title,
  base,
  className,
  preview = true,
  code = true,
  children,
}: {
  name?: string;
  src?: string;
  title?: string;
  base?: string;
  className?: string;
  preview?: boolean;
  code?: boolean;
  children?: ReactNode;
}) => {
  if (!(preview || code)) {
    return null;
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border">
      {preview ? (
        <div
          className={cn(
            "preview relative flex min-h-[300px] w-full items-center justify-center bg-muted/10 p-6 sm:p-10",
            className
          )}
        >
          {children}
        </div>
      ) : null}
      {code ? (
        <ComponentSource
          name={name}
          src={src}
          title={title}
          base={base}
          navTriggerClassName="top-2"
          className={cn(
            "bg-code md:mx-0 [&_[data-rehype-pretty-code-figure]]:mx-0 [&_[data-rehype-pretty-code-figure]]:rounded-none",
            // Inside a preview the collapsible sits below the divider, so the
            // default docs margin (mt-6) would leave an empty band under it.
            // The pre keeps a top strip instead so the Expand/Copy buttons
            // do not collide with the first code line.
            preview &&
              "border-t [&_[data-slot=collapsible-content]]:mt-0 [&_pre]:pt-11"
          )}
        />
      ) : null}
    </div>
  );
};
