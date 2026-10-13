// Patrones de galería consumen primitivos de registry-kromm-ui
// Ejemplo:
// import { SignaturePad } from "@/registry-kromm-ui/bases/base/kromm-ui/signature-pad";

import { SignaturePadFormPattern } from "./patterns/signature-pad-form-pattern";

export const patterns = [
  {
    Component: SignaturePadFormPattern,
    description: "Patrón compuesto con SignaturePad + acciones absolutas",
    id: "signature-pad-form",
    title: "Signature Pad Form",
  },
];
