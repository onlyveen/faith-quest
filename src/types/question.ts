export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-based index into options
  difficulty: Difficulty;
  reference?: string; // e.g. Bible verse citation shown after the answer is revealed
}

export interface LifelineState {
  fiftyFifty: boolean;
  askAudience: boolean;
  graceGuess: boolean;
}

export type LifelineKey = keyof LifelineState;
