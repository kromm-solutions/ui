"use client";

import { cn } from "cn";
import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/registry/bases/base/ui/button";

/**
 * Both icons stay mounted and cross-fade, so the idle -> copied change animates
 * in and out instead of snapping. The transition is opt-in, so reduced motion
 * gets an instant swap.
 */
const iconTransition =
  "motion-safe:transition-[opacity,filter,scale] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";

export function CodeBlockCopy({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
}) {
  const [copied, setCopied] = React.useState(false);

  // The reset lives in an effect keyed on `copied`. A timeout ref would need
  // `useRef(undefined)`, and the project's autofix strips that argument, which
  // leaves a zero-argument call the React types reject.
  React.useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context or denied permission): stay on the
      // "Copy" label rather than report a copy that did not happen.
      setCopied(false);
    }
  };

  return (
    <>
      <Button
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn("text-muted-foreground hover:text-foreground", className)}
        data-slot="code-block-copy"
        onClick={handleCopy}
        size="icon-sm"
        type="button"
        variant="ghost"
        {...props}
      >
        <span className="relative flex size-4 items-center justify-center">
          <CheckIcon
            aria-hidden="true"
            className={cn(
              iconTransition,
              "absolute inset-0",
              copied
                ? "scale-100 opacity-100 blur-[0px]"
                : "scale-[0.25] opacity-0 blur-[4px]"
            )}
          />
          <CopyIcon
            aria-hidden="true"
            className={cn(
              iconTransition,
              copied
                ? "scale-[0.25] opacity-0 blur-[4px]"
                : "scale-100 opacity-100 blur-[0px]"
            )}
          />
        </span>
      </Button>
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
