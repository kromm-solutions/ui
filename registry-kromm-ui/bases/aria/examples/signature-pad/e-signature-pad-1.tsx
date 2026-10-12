"use client";

import { Eraser, Save, Undo2 } from "lucide-react";

import {
  SignaturePad,
  SignaturePadAction,
  SignaturePadCanvas,
  SignaturePadClear,
  SignaturePadSave,
  SignaturePadUndo,
} from "@/registry-kromm-ui/bases/aria/kromm-ui/signature-pad";
import { Separator } from "@/registry/bases/aria/ui/separator";

export function E_Signature_Pad_1() {
  return (
    <SignaturePad onSave={(url) => console.log(url)}>
      <SignaturePadCanvas />
      <SignaturePadAction>
        <div className="flex items-center gap-1 sm:gap-2 h-4">
          <SignaturePadUndo>
            <Undo2 data-icon="inline-start" />
            Undo
          </SignaturePadUndo>
          <Separator orientation="vertical" />
          <SignaturePadClear>
            <Eraser data-icon="inline-start" />
            Clear
          </SignaturePadClear>
        </div>
        <SignaturePadSave>
          <Save data-icon="inline-start" />
          Save
        </SignaturePadSave>
      </SignaturePadAction>
    </SignaturePad>
  );
}
