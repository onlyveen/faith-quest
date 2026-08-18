export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  question: Record<string, string>; // keyed by language code, e.g. { te, en, kn }
  options: Record<string, string[]>; // keyed by language code
  correctIndex: number; // 0-based index into options, shared across all languages
  difficulty: Difficulty;
  reference?: Record<string, string>; // e.g. Bible verse citation shown after the answer is revealed
}

export interface LifelineState {
  fiftyFifty: boolean;
  askAudience: boolean;
  graceGuess: boolean;
}

export type LifelineKey = keyof LifelineState;
