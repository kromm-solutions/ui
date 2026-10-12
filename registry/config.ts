import type { Registry } from "shadcn/schema";

import { fonts, THEMES } from "@/kromm/registry";
import { ui as ariaKrommUi } from "@/registry-kromm-ui/bases/aria/kromm-ui/registry";
import { ui as baseKrommUi } from "@/registry-kromm-ui/bases/base/kromm-ui/registry";
import { ui as radixKrommUi } from "@/registry-kromm-ui/bases/radix/kromm-ui/registry";
import { ui as ariaBaseUi } from "@/registry/bases/aria/registry";
import { ui as baseBaseUi } from "@/registry/bases/base/registry";
import { ui as radixBaseUi } from "@/registry/bases/radix/registry";

export const registry: Registry = {
  homepage: "https://github.com/kromm-solutions/ui",
  items: [
    ...(radixBaseUi || []),
    ...(baseBaseUi || []),
    ...(ariaBaseUi || []),
    ...(radixKrommUi || []),
    ...(ariaKrommUi || []),
    ...(baseKrommUi || []),
    ...(THEMES || []),
    ...(fonts || []),
  ],
  name: "kromm-ui",
};
