#!/usr/bin/env node
/**
 * Distribution smoke test for the kromm ui registry.
 *
 * Verifies that the deployed registry at BASE_URL actually serves the
 * artifacts the shadcn CLI consumes: the registry manifest, the styles
 * index, one real component per headless base, and the agent-discovery
 * endpoints. Run locally with:
 *
 *   node scripts/smoke-distribution.mjs [baseUrl]
 *
 * Defaults to https://ui.kromm.io. Exits 1 if any check fails.
 */

const BASE_URL = (
  process.argv[2] ??
  process.env.BASE_URL ??
  "https://ui.kromm.io"
).replace(/\/$/, "");

const BASES = ["base", "radix", "aria"];
const STYLE = "nova";
const PROBE_COMPONENT = "signature-pad";

const failures = [];
let checked = 0;

async function check(label, url, validate) {
  checked += 1;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      failures.push(`${label}: HTTP ${res.status} (${url})`);
      console.log(`✗ ${label} — HTTP ${res.status}`);
      return;
    }
    const body = await res.text();
    const problem = validate(body);
    if (problem) {
      failures.push(`${label}: ${problem} (${url})`);
      console.log(`✗ ${label} — ${problem}`);
      return;
    }
    console.log(`✓ ${label}`);
  } catch (error) {
    failures.push(`${label}: ${error.message} (${url})`);
    console.log(`✗ ${label} — ${error.message}`);
  }
}

function isJsonWith(condition) {
  return (body) => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return "response is not valid JSON";
    }
    return condition(data) ? null : "JSON shape mismatch";
  };
}

const isComponentItem = isJsonWith(
  (d) =>
    typeof d.name === "string" &&
    typeof d.type === "string" &&
    Array.isArray(d.files) &&
    d.files.length > 0 &&
    d.files.every(
      (f) => typeof f.path === "string" && typeof f.content === "string"
    )
);

console.log(`Smoke-testing registry distribution at ${BASE_URL}\n`);

await check(
  "registry manifest",
  `${BASE_URL}/r/registry.json`,
  isJsonWith((d) => Array.isArray(d.items) && d.items.length > 0)
);

await check(
  "styles index",
  `${BASE_URL}/r/styles/index.json`,
  isJsonWith((d) => Array.isArray(d) && d.length > 0)
);

for (const base of BASES) {
  await check(
    `component (${base}-${STYLE}/${PROBE_COMPONENT})`,
    `${BASE_URL}/r/styles/${base}-${STYLE}/${PROBE_COMPONENT}.json`,
    isComponentItem
  );
}

await check("llms.txt", `${BASE_URL}/llms.txt`, (body) =>
  body.trim().length > 0 ? null : "empty body"
);

await check(
  "openapi.json",
  `${BASE_URL}/openapi.json`,
  isJsonWith((d) => typeof d.openapi === "string")
);

console.log(`\n${checked - failures.length}/${checked} checks passed.`);

if (failures.length > 0) {
  console.error(
    `\n❌ Distribution smoke FAILED:\n${failures.map((f) => `  - ${f}`).join("\n")}`
  );
  process.exit(1);
}

console.log(
  "✅ Distribution smoke passed — the registry is installable from production."
);
