import type { Question } from "../types/question";

/** Placeholder question set for preview mode (`?mock=1`) — see QuizContext. */
export function mockQuizSet(): Question[] {
  const make = (
    id: string,
    q: string,
    options: string[],
    correctIndex: number,
    difficulty: Question["difficulty"],
    reference?: string,
  ): Question => ({ id, question: q, options, correctIndex, difficulty, reference });

  const easy = Array.from({ length: 5 }, (_, i) =>
    make(
      `easy-${i}`,
      `ఏ జీవి తుమ్మగా వెలుగు ప్రకాశించెను. (${i + 1})`,
      ["నిప్పుకోడి", "మకరము", "బల్లి", "మేకపోతు"],
      2,
      "Easy",
      `Genesis 1:${i + 1}`,
    ),
  );
  const medium = Array.from({ length: 5 }, (_, i) =>
    make(
      `medium-${i}`,
      `మధ్యస్థ ప్రశ్న సంఖ్య ${i + 1}?`,
      ["ఎంపిక A", "ఎంపిక B", "ఎంపిక C", "ఎంపిక D"],
      i % 4,
      "Medium",
      `Exodus ${i + 1}:${i + 1}`,
    ),
  );
  const hard = Array.from({ length: 5 }, (_, i) =>
    make(
      `hard-${i}`,
      `కష్టమైన ప్రశ్న సంఖ్య ${i + 1}?`,
      ["ఎంపిక A", "ఎంపిక B", "ఎంపిక C", "ఎంపిక D"],
      i % 4,
      "Hard",
      `John ${i + 1}:${i + 1}`,
    ),
  );

  return [...easy, ...medium, ...hard];
}
