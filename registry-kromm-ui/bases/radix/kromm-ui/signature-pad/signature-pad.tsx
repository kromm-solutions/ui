"use client";

import { cn } from "cn";
import * as React from "react";

import type { SignatureData, SignaturePen } from "./core/types";
import { SignaturePadProvider, useSignaturePad } from "./signature-pad-context";

type SignaturePadProps = React.ComponentProps<"div"> & {
  value?: SignatureData | null;
  defaultValue?: SignatureData | null;

  onValueChange?: (value: SignatureData | null) => void;

  onSave?: (dataUrl: string | null) => void;

  disabled?: boolean;
  readOnly?: boolean;

  pen?: SignaturePen;
};

export function SignaturePad({
  className,
  value,
  defaultValue,
  onValueChange,
  onSave,
  disabled,
  readOnly,
  pen,
  children,
  ...props
}: SignaturePadProps) {
  // Backward compat: if onValueChange is provided but doesn't look like it expects SignatureData,
  // treat it as the legacy callback expecting data URL string
  const onValueChangeLegacy = onValueChange as (dataUrl: string | null) => void;

  return (
    <SignaturePadProvider
      value={value}
      defaultValue={defaultValue}
      onValueChange={undefined} // We'll handle via legacy for compat
      onValueChangeLegacy={onValueChangeLegacy}
      onSave={onSave}
      disabled={disabled}
      readOnly={readOnly}
      pen={pen}
    >
      <SignaturePadRoot className={className} {...props}>
        {children}
      </SignaturePadRoot>
    </SignaturePadProvider>
  );
}

function SignaturePadRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { disabled, readOnly } = useSignaturePad();

  return (
    <div
      data-slot="signature-pad"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        "relative flex w-full min-w-0 flex-col overflow-hidden",
        "rounded-md border bg-background",
        "transition-[color,box-shadow]",
        "has-[[data-slot=signature-pad-canvas]:focus-visible]:border-ring",
        "has-[[data-slot=signature-pad-canvas]:focus-visible]:ring-2",
        "has-[[data-slot=signature-pad-canvas]:focus-visible]:ring-ring/30",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
