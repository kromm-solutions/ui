"use client";

import * as React from "react";

import {
  SignaturePad,
  SignaturePadCanvas,
  SignaturePadActions,
  SignaturePadAction,
  SignaturePadUndo,
  SignaturePadClear,
  SignaturePadSave,
} from "@/registry-kromm-ui/bases/base/kromm-ui/signature-pad";

export function SignaturePadFormPattern() {
  return (
    <div className="w-full max-w-xl">
      <SignaturePad className="relative h-[320px] border rounded-lg bg-white">
        <SignaturePadCanvas className="h-full w-full" />
        <SignaturePadActions className="absolute inset-x-0 bottom-0 p-2">
          <SignaturePadAction className="flex justify-between">
            <div className="flex gap-2">
              <SignaturePadUndo />
              <SignaturePadClear>Limpiar</SignaturePadClear>
            </div>
            <SignaturePadSave>Guardar</SignaturePadSave>
          </SignaturePadAction>
        </SignaturePadActions>
      </SignaturePad>
    </div>
  );
}
