import type { ComponentType } from "react";

import { AppShell01 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-01/app-shell-01";
import { AppShell02 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-02/app-shell-02";
import { AppShell03 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-03/app-shell-03";
import { AppShell04 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-04/app-shell-04";
import { AppShell05 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-05/app-shell-05";
import { AppShell07 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-07/app-shell-07";
import { AppShell08 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-08/app-shell-08";
import { AppShell09 } from "@/registry-kromm-ui/bases/base/blocks/application/app-shell/app-shell-09/app-shell-09";

// NOTE: app-shell-06 and app-shell-10 are excluded while they are WIP
// (they depend on Field/Switch APIs that do not exist yet in base/ui and
// they fail typecheck). Re-add them once they are finished.
export const previewBlocks: Record<string, Record<string, ComponentType>> = {
  base: {
    "app-shell-01": AppShell01,
    "app-shell-02": AppShell02,
    "app-shell-03": AppShell03,
    "app-shell-04": AppShell04,
    "app-shell-05": AppShell05,
    "app-shell-07": AppShell07,
    "app-shell-08": AppShell08,
    "app-shell-09": AppShell09,
  },
};
