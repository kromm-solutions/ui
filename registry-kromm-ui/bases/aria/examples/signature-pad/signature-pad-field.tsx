"use client";

import { Eraser, Save, Undo2 } from "lucide-react";
import { useState } from "react";

import {
  SignaturePad,
  SignaturePadAction,
  SignaturePadActions,
  SignaturePadCanvas,
  SignaturePadClear,
  SignaturePadSave,
  SignaturePadUndo,
} from "@/registry-kromm-ui/bases/aria/kromm-ui/signature-pad";
import type { SignatureData } from "@/registry-kromm-ui/bases/aria/kromm-ui/signature-pad";
import { Button } from "@/registry/bases/aria/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/bases/aria/ui/field";
import { Input } from "@/registry/bases/aria/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/aria/ui/native-select";
import { Separator } from "@/registry/bases/aria/ui/separator";

export function SignaturePadField() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreement, setAgreement] = useState("nda");
  const [signature, setSignature] = useState<SignatureData | string | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    email: email.trim() ? "" : "Enter your email address.",
    name: name.trim() ? "" : "Enter your full name.",
    signature: signature ? "" : "Add your signature before submitting.",
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.email || errors.signature) {
      return;
    }
    console.log({ agreement, email, name, signature });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Sign a document</FieldLegend>
        <FieldDescription>
          Review your details and draw your signature to confirm.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="signature-name">Full name</FieldLabel>
            <Input
              id="signature-name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={submitted && !!errors.name}
            />
            <FieldError>{submitted && errors.name}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="signature-email">Email</FieldLabel>
            <Input
              id="signature-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ada@lovelace.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={submitted && !!errors.email}
            />
            <FieldError>{submitted && errors.email}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="signature-agreement">Agreement</FieldLabel>
            <NativeSelect
              id="signature-agreement"
              name="agreement"
              value={agreement}
              onChange={(event) => setAgreement(event.target.value)}
            >
              <NativeSelectOption value="nda">
                Non-disclosure agreement
              </NativeSelectOption>
              <NativeSelectOption value="contract">
                Employment contract
              </NativeSelectOption>
              <NativeSelectOption value="services">
                Service agreement
              </NativeSelectOption>
            </NativeSelect>
            <FieldDescription>
              The document this signature applies to.
            </FieldDescription>
          </Field>
          <Field data-invalid={submitted && !!errors.signature}>
            <FieldLabel>Signature</FieldLabel>
            <SignaturePad
              aria-invalid={submitted && !!errors.signature}
              onValueChange={setSignature}
              onSave={(url) => console.log(url)}
            >
              <SignaturePadCanvas />
              <SignaturePadActions>
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
            <FieldDescription>
              Draw with your mouse or finger, then save.
            </FieldDescription>
            <FieldError>{submitted && errors.signature}</FieldError>
          </Field>
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Sign document</Button>
        </div>
      </FieldSet>
    </form>
  );
}
