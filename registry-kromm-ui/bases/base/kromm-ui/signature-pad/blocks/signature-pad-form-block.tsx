"use client";

import { SignaturePad, SignaturePadCanvas, SignaturePadActions, SignaturePadAction, SignaturePadUndo, SignaturePadClear } from "../index";

export function SignaturePadFormBlock() {
  return (
    <SignaturePad className="relative">
      <SignaturePadCanvas />
      <SignaturePadActions className="absolute bottom-0 w-full">
        <SignaturePadAction>
          <SignaturePadUndo />
          <SignaturePadClear />
        </SignaturePadAction>
      </SignaturePadActions>
    </SignaturePad>
  );
}
