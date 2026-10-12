"use client";

import { cn } from "cn";
import * as React from "react";

import { Button } from "@/registry/bases/aria/ui/button";

import { useSignaturePad } from "./signature-pad-context";

export function SignaturePadActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="signature-pad-actions"
      className={cn("", className)}
      {...props}
    />
  );
}

export function SignaturePadAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="signature-pad-action"
      className={cn("flex items-center justify-between gap-2 p-2", className)}
      {...props}
    />
  );
}

export function SignaturePadClear(props: React.ComponentProps<typeof Button>) {
  const { clear, value, disabled, readOnly } = useSignaturePad();

  const isEmpty = !value || value.strokes.length === 0;

  return (
    <Button
      type="button"
      variant="ghost"
      isDisabled={disabled || readOnly || isEmpty}
      onPress={clear}
      {...props}
    />
  );
}

export function SignaturePadUndo(props: React.ComponentProps<typeof Button>) {
  const { undo, canUndo, disabled, readOnly } = useSignaturePad();

  return (
    <Button
      type="button"
      variant="ghost"
      isDisabled={disabled || readOnly || !canUndo}
      onPress={undo}
      {...props}
    />
  );
}

export function SignaturePadRedo(props: React.ComponentProps<typeof Button>) {
  const { redo, canRedo, disabled, readOnly } = useSignaturePad();

  return (
    <Button
      type="button"
      variant="ghost"
      isDisabled={disabled || readOnly || !canRedo}
      onPress={redo}
      {...props}
    />
  );
}

export function SignaturePadSave(props: React.ComponentProps<typeof Button>) {
  const { save, value, disabled, readOnly } = useSignaturePad();

  const isEmpty = !value || value.strokes.length === 0;

  return (
    <Button
      type="button"
      variant="ghost"
      isDisabled={disabled || readOnly || isEmpty}
      onPress={save}
      {...props}
    />
  );
}
