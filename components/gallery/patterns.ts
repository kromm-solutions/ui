// Patrones de galería consumen primitivos de registry-kromm-ui
// Ejemplo:
// import { SignaturePad } from "@/registry-kromm-ui/bases/base/kromm-ui/signature-pad";

import { SignaturePadFormPattern } from "./patterns/signature-pad-form-pattern";

export const patterns = [
  {
    id: "signature-pad-form",
    title: "Signature Pad Form",
    description: "Patrón compuesto con SignaturePad + acciones absolutas",
    Component: SignaturePadFormPattern,
  },
];
