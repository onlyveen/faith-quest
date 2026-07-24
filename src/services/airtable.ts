import type { Difficulty, Question } from "../types/question";
import { appConfig } from "../config/appConfig";

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY as string;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string;

function tableUrl(table: string, path = "") {
  return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}${path}`;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

export class NotEnoughQuestionsError extends Error {
  difficulty: Difficulty;
  available: number;
  needed: number;

  constructor(difficulty: Difficulty, available: number, needed: number) {
    super(
      `Not enough "${difficulty}" questions available: found ${available}, need ${needed}.`,
    );
    this.name = "NotEnoughQuestionsError";
    this.difficulty = difficulty;
    this.available = available;
    this.needed = needed;
  }
}

function recordToQuestion(record: AirtableRecord): Question | null {
  const question = record.fields["Question"];
  const optionsRaw = record.fields["Options"];
  const correctRaw = record.fields["Correct"];
  const difficulty = record.fields["Difficulty"];

  if (
    typeof question !== "string" ||
    typeof optionsRaw !== "string" ||
    typeof difficulty !== "string"
  ) {
    return null;
  }

  const options = optionsRaw.split("|").map((o) => o.trim());
  const correctNumber = Number(correctRaw);
  if (!Number.isInteger(correctNumber) || correctNumber < 1 || correctNumber > options.length) {
    return null;
  }

  return {
    id: record.id,
    question,
    options,
    correctIndex: correctNumber - 1,
    difficulty: difficulty as Difficulty,
  };
}

async function listAllRecords(
  table: string,
  filterByFormula?: string,
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    if (filterByFormula) params.set("filterByFormula", filterByFormula);
    if (offset) params.set("offset", offset);
    params.set("pageSize", "100");

    const res = await fetch(tableUrl(table, `?${params.toString()}`), {
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error(
        `Airtable request failed (${res.status}): ${await res.text()}`,
      );
    }
    const data = (await res.json()) as AirtableListResponse;
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function listUnseenQuestions(
  table: string,
  difficulty: Difficulty,
): Promise<Question[]> {
  // Treat anything other than an explicit "seen" as available — covers
  // blank/never-set Status (the common case today) as well as "unseen".
  const formula = `AND({Difficulty}='${difficulty}', NOT({Status}='seen'))`;
  const records = await listAllRecords(table, formula);
  return records
    .map(recordToQuestion)
    .filter((q): q is Question => q !== null);
}

/** Fetches every record in a table, mapped to `Question` (skips malformed rows). */
export async function listAllQuestions(table: string): Promise<Question[]> {
  const records = await listAllRecords(table);
  return records
    .map(recordToQuestion)
    .filter((q): q is Question => q !== null);
}

export interface NewQuestionRecord {
  question: string;
  options: string[];
  correctIndex: number; // 0-based
  difficulty: Difficulty;
}

/** Creates new records in a table, batched at Airtable's 10-per-request limit. */
export async function createRecords(
  table: string,
  records: NewQuestionRecord[],
): Promise<void> {
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);
    const res = await fetch(tableUrl(table), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        records: batch.map((r) => ({
          fields: {
            Question: r.question,
            Options: r.options.join(" | "),
            Correct: r.correctIndex + 1,
            Difficulty: r.difficulty,
          },
        })),
      }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to create records (${res.status}): ${await res.text()}`,
      );
    }
  }
}

/** Pulls a full 15-question round: 5 Easy, 5 Medium, 5 Hard, in that order. */
export async function fetchQuizSet(table: string): Promise<Question[]> {
  const needed = appConfig.questionsPerDifficulty;
  const set: Question[] = [];

  for (const difficulty of appConfig.difficultyOrder) {
    const pool = await listUnseenQuestions(table, difficulty);
    if (pool.length < needed) {
      throw new NotEnoughQuestionsError(difficulty, pool.length, needed);
    }
    set.push(...shuffle(pool).slice(0, needed));
  }

  return set;
}

export async function markQuestionSeen(
  table: string,
  recordId: string,
): Promise<void> {
  const res = await fetch(tableUrl(table, `/${recordId}`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ fields: { Status: "seen" } }),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to mark question seen (${res.status}): ${await res.text()}`,
    );
  }
}

/** Bulk-resets every "seen" record's Status back to "unseen" so the bank can be replayed. */
export async function resetAllStatuses(table: string): Promise<number> {
  const records = await listAllRecords(table);
  const toReset = records.filter((r) => r.fields["Status"] === "seen");

  for (let i = 0; i < toReset.length; i += 10) {
    const batch = toReset.slice(i, i + 10);
    const res = await fetch(tableUrl(table), {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        records: batch.map((r) => ({ id: r.id, fields: { Status: "unseen" } })),
      }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to reset statuses (${res.status}): ${await res.text()}`,
      );
    }
  }

  return toReset.length;
}
