"use client";

import { Eraser, Save, Undo2 } from "lucide-react";

import {
  SignaturePad,
  SignaturePadAction,
  SignaturePadActions,
  SignaturePadCanvas,
  SignaturePadClear,
  SignaturePadSave,
  SignaturePadUndo,
} from "@/registry-kromm-ui/bases/base/kromm-ui/signature-pad";
import { Separator } from "@/registry/bases/base/ui/separator";

export function SignaturePadDefault() {
  return (
    <SignaturePad onSave={(url) => console.log(url)} className="relative">
      <SignaturePadCanvas />
      <SignaturePadActions className="absolute bottom-0 w-full">
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
      </SignaturePadActions>
    </SignaturePad>
  );
}
