import type { z } from "zod";

/**
 * Parses a raw JSON module against a Zod schema, failing fast with the
 * data-file name in the error so build/dev logs point at the culprit.
 */
export function parseData<T>(
  raw: unknown,
  schema: z.ZodType<T>,
  label: string
): T {
  const result = schema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid registry data in ${label}:\n${details}`, {
      cause: result.error,
    });
  }

  return result.data;
}
