import path from "node:path";

import { readFileFromRoot } from "@/kromm/read-file";

export const readOptionalFromRoot = async (
  relativePath: string
): Promise<string | null> => {
  try {
    return await readFileFromRoot(relativePath);
  } catch {
    return null;
  }
};

export const getRegistryUiSourceCandidates = ({
  name,
  base,
}: {
  name: string;
  base?: string;
}) =>
  base
    ? [
        path.join("registry", "bases", base, "ui", `${name}.tsx`),
        path.join("registry", "bases", base, `${name}.tsx`),
        path.join(
          "registry-kromm-ui",
          "bases",
          base,
          "kromm-ui",
          name,
          `${name}.tsx`
        ),
        path.join(
          "registry-kromm-ui",
          "bases",
          base,
          "kromm-ui",
          `${name}.tsx`
        ),
      ]
    : [path.join("components", "ui", `${name}.tsx`)];

export const getDemoSource = (name: string): Promise<string | null> =>
  readOptionalFromRoot(path.join("examples", `${name}.tsx`));

export const getRegistrySource = async (
  name: string,
  base?: string
): Promise<string | null> => {
  const candidates = getRegistryUiSourceCandidates({ base, name });

  for (const candidate of candidates) {
    const code = await readOptionalFromRoot(candidate);
    if (code) {
      return code;
    }
  }

  return null;
};
