// Pushes generated English/Kannada translations into the "Questions" table,
// filling in the "(English)" / "(Kannada)" fields alongside the existing
// Telugu ones. Batched at Airtable's 10-per-request limit.
//
// Expects a JSON file shaped like:
// [
//   {
//     "id": "recXXXXXXXXXXXXXX",
//     "en": { "question": "...", "options": ["...", "...", "...", "..."], "reference": "..." },
//     "kn": { "question": "...", "options": ["...", "...", "...", "..."], "reference": "..." }
//   },
//   ...
// ]
//
// Usage:
//   node --env-file=.env scripts/push-translations.mjs scripts/translations.json            (dry run)
//   node --env-file=.env scripts/push-translations.mjs scripts/translations.json --apply     (writes)

import { readFile } from "node:fs/promises";

const API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.error("Missing VITE_AIRTABLE_API_KEY / VITE_AIRTABLE_BASE_ID.");
  process.exit(1);
}

const IN_PATH = process.argv[2];
const APPLY = process.argv.includes("--apply");

if (!IN_PATH) {
  console.error("Usage: node --env-file=.env scripts/push-translations.mjs <translations.json> [--apply]");
  process.exit(1);
}

const entries = JSON.parse(await readFile(IN_PATH, "utf8"));

console.log(`Mode: ${APPLY ? "APPLY (will write to Airtable)" : "DRY RUN (no writes)"}`);
console.log(`Loaded ${entries.length} translation entries from ${IN_PATH}\n`);

const problems = [];
for (const e of entries) {
  if (!e.id) problems.push(`Missing id: ${JSON.stringify(e).slice(0, 80)}`);
  for (const lang of ["en", "kn"]) {
    const t = e[lang];
    if (!t) {
      problems.push(`${e.id}: missing "${lang}" translation`);
      continue;
    }
    if (!t.question) problems.push(`${e.id}: missing "${lang}" question`);
    if (!Array.isArray(t.options) || t.options.length < 2) {
      problems.push(`${e.id}: "${lang}" options malformed (${JSON.stringify(t.options)})`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s) found — fix these before pushing:`);
  problems.slice(0, 30).forEach((p) => console.error(`  - ${p}`));
  if (problems.length > 30) console.error(`  ...and ${problems.length - 30} more`);
  process.exit(1);
}

console.log("Sample entry:");
console.log(JSON.stringify(entries[0], null, 2));

if (!APPLY) {
  console.log("\nDry run only — nothing written. Re-run with --apply to write these fields.");
  process.exit(0);
}

for (let i = 0; i < entries.length; i += 10) {
  const batch = entries.slice(i, i + 10);
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Questions`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: batch.map((e) => ({
        id: e.id,
        fields: {
          "Question (English)": e.en.question,
          "Options (English)": e.en.options.join(" | "),
          ...(e.en.reference ? { "Reference (English)": e.en.reference } : {}),
          "Question (Kannada)": e.kn.question,
          "Options (Kannada)": e.kn.options.join(" | "),
          ...(e.kn.reference ? { "Reference (Kannada)": e.kn.reference } : {}),
        },
      })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update batch at ${i} (${res.status}): ${await res.text()}`);
  }
  console.log(`  wrote ${Math.min(i + 10, entries.length)}/${entries.length}`);
}

console.log("\nDone.");
