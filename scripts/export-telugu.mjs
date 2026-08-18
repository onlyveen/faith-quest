// Exports the canonical Telugu question bank ("Questions" table) to JSON so
// translations can be generated offline, then pushed back with
// push-translations.mjs.
//
// Usage: node --env-file=.env scripts/export-telugu.mjs

import { writeFile } from "node:fs/promises";

const API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.error("Missing VITE_AIRTABLE_API_KEY / VITE_AIRTABLE_BASE_ID.");
  process.exit(1);
}

const OUT_PATH = process.argv[2] || "scripts/telugu-questions.json";

async function listAllRecords(table) {
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}?${params}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Failed to list "${table}" (${res.status}): ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

const records = await listAllRecords("Questions");

const out = records.map((r) => ({
  id: r.id,
  question: r.fields["Question (Telugu)"] ?? "",
  options: (r.fields["Options (Telugu)"] ?? "").split("|").map((o) => o.trim()),
  correct: r.fields["Correct"],
  difficulty: r.fields["Difficulty"],
  reference: r.fields["Reference (Telugu)"] ?? "",
}));

await writeFile(OUT_PATH, JSON.stringify(out, null, 2), "utf8");
console.log(`Exported ${out.length} records to ${OUT_PATH}`);
