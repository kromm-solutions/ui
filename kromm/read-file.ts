import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Package root (packages/registry) — resolvable regardless of process.cwd().
// NOTE: keep fileURLToPath(import.meta.url); import.meta.dirname is undefined
// when this module is bundled into the Next.js client runtime.
const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

// Candidate roots, in order: the registry package (registry/, registry-kromm-ui/,
// lib/, scripts/) and the current working directory (the Next.js app: content/,
// components/, public/...). Pre-monorepo both lived under the repo root; the
// first match wins so every historical call site keeps working.
const ROOTS = [PACKAGE_ROOT, process.cwd()];

export const readFileFromRoot = async (relativePath: string) => {
  let lastError: unknown;
  for (const root of ROOTS) {
    try {
      return await fs.readFile(path.join(root, relativePath), "utf-8");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};
