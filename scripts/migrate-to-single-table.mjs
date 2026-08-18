// One-off migration: merges the 3 per-language Airtable tables (Questions
// Telugu / English / Kannada) into a single "Questions" table with
// per-language columns, so the base stays under Airtable's 1000-record cap.
//
// Assumes row N in each old table is the same question translated 3 ways
// (same order, same count). Read-only against the old tables — it only
// creates new rows in the target table, never deletes or edits the old ones.
//
// Usage:
//   node --env-file=.env scripts/migrate-to-single-table.mjs            (dry run)
//   node --env-file=.env scripts/migrate-to-single-table.mjs --apply    (writes)

const API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.error(
    "Missing VITE_AIRTABLE_API_KEY / VITE_AIRTABLE_BASE_ID. Run with: node --env-file=.env scripts/migrate-to-single-table.mjs",
  );
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");

const TARGET_TABLE = "Questions";
const SOURCE_TABLES = [
  { code: "te", table: "Questions Telugu", fieldLabel: "Telugu" },
  { code: "en", table: "Questions English", fieldLabel: "English" },
  { code: "kn", table: "Questions Kannada", fieldLabel: "Kannada" },
];

function tableUrl(table, path = "") {
  return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}${path}`;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function listAllRecords(table) {
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams();
    if (offset) params.set("offset", offset);
    params.set("pageSize", "100");
    const res = await fetch(tableUrl(table, `?${params.toString()}`), {
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to list "${table}" (${res.status}): ${await res.text()}`);
    }
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

function langField(base, fieldLabel) {
  return `${base} (${fieldLabel})`;
}

async function main() {
  console.log(`Mode: ${APPLY ? "APPLY (will write to Airtable)" : "DRY RUN (no writes)"}\n`);

  const bySource = {};
  for (const { code, table } of SOURCE_TABLES) {
    const records = await listAllRecords(table);
    bySource[code] = records;
    console.log(`Fetched ${records.length} rows from "${table}"`);
  }

  const counts = SOURCE_TABLES.map(({ code }) => bySource[code].length);
  if (new Set(counts).size !== 1) {
    console.error(
      `\nRow counts differ across tables (${SOURCE_TABLES.map((s, i) => `${s.table}=${counts[i]}`).join(", ")}). ` +
        `Migration assumes 1:1 row alignment by order — aborting so nothing gets mismatched. ` +
        `Fix the counts (or align the extra rows manually) and re-run.`,
    );
    process.exit(1);
  }

  const total = counts[0];
  const merged = [];
  const warnings = [];

  for (let i = 0; i < total; i++) {
    const rows = Object.fromEntries(SOURCE_TABLES.map(({ code }) => [code, bySource[code][i]]));
    const primary = rows.te.fields; // Telugu row is canonical for shared fields

    const correctValues = SOURCE_TABLES.map(({ code }) => rows[code].fields["Correct"]);
    if (new Set(correctValues.map(String)).size > 1) {
      warnings.push(
        `Row ${i + 1}: "Correct" differs across languages (${correctValues.join(" / ")}) — used Telugu's value.`,
      );
    }

    const difficultyValues = SOURCE_TABLES.map(({ code }) => rows[code].fields["Difficulty"]);
    if (new Set(difficultyValues).size > 1) {
      warnings.push(
        `Row ${i + 1}: "Difficulty" differs across languages (${difficultyValues.join(" / ")}) — used Telugu's value.`,
      );
    }

    const anySeen = SOURCE_TABLES.some(({ code }) => rows[code].fields["Status"] === "seen");

    const fields = {
      Correct: primary["Correct"],
      Difficulty: primary["Difficulty"],
      Status: anySeen ? "seen" : "",
    };

    for (const { code, fieldLabel } of SOURCE_TABLES) {
      const f = rows[code].fields;
      fields[langField("Question", fieldLabel)] = f["Question"] ?? "";
      fields[langField("Options", fieldLabel)] = f["Options"] ?? "";
      if (f["Reference"]) fields[langField("Reference", fieldLabel)] = f["Reference"];
    }

    merged.push(fields);
  }

  console.log(`\nBuilt ${merged.length} merged rows for "${TARGET_TABLE}".`);
  if (warnings.length) {
    console.log(`\n${warnings.length} mismatch warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  console.log("\nSample merged row:");
  console.log(JSON.stringify(merged[0], null, 2));

  if (!APPLY) {
    console.log("\nDry run only — nothing written. Re-run with --apply to create these records.");
    return;
  }

  console.log(`\nWriting ${merged.length} records to "${TARGET_TABLE}"...`);
  for (let i = 0; i < merged.length; i += 10) {
    const batch = merged.slice(i, i + 10);
    const res = await fetch(tableUrl(TARGET_TABLE), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ records: batch.map((fields) => ({ fields })) }),
    });
    if (!res.ok) {
      throw new Error(`Failed to create records (${res.status}): ${await res.text()}`);
    }
    console.log(`  wrote ${Math.min(i + 10, merged.length)}/${merged.length}`);
  }

  console.log(
    `\nDone. Verify "${TARGET_TABLE}" in Airtable, then delete the old per-language tables once you're confident.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
