// Registry system facade: docs consume `BASES` from here.
// Source of truth is `registry/data/bases.json`, resolved + validated by
// `lib/registry` (Zod). Re-exported so consumers keep a stable import path.
export { BASE_NAMES, BASES, type Base } from "@/kromm/registry";
