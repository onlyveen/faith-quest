import { appConfig } from "../config/appConfig";

/** Manna amount for a given 1-based question number. */
export function amountForQuestion(questionNumber: number): number {
  return appConfig.ladder[questionNumber - 1] ?? 0;
}

export type LadderTier = "steel" | "silver" | "gold" | "diamond";

/**
 * Reward-plate material for a given 1-based question number:
 * the first checkpoint is silver, the second is gold, the final
 * question is diamond, everything else is a plain steel plate.
 */
export function tierForQuestion(questionNumber: number): LadderTier {
  if (questionNumber >= appConfig.ladder.length) return "diamond";
  const checkpointIndex = appConfig.checkpoints.indexOf(questionNumber);
  if (checkpointIndex === 1) return "gold";
  if (checkpointIndex === 0) return "silver";
  return "steel";
}

/** Highest checkpoint amount guaranteed once `lastCorrectQuestionNumber` questions are cleared. */
export function getWalkAwayAmount(lastCorrectQuestionNumber: number): number {
  const reachedCheckpoints = appConfig.checkpoints.filter(
    (checkpoint) => lastCorrectQuestionNumber >= checkpoint,
  );
  if (reachedCheckpoints.length === 0) return 0;
  return amountForQuestion(Math.max(...reachedCheckpoints));
}

export function percentComplete(questionNumber: number, total: number): number {
  return Math.round(((questionNumber - 1) / total) * 100);
}

export function difficultyForQuestion(
  questionNumber: number,
): "Easy" | "Medium" | "Hard" {
  const perTier = appConfig.questionsPerDifficulty;
  if (questionNumber <= perTier) return "Easy";
  if (questionNumber <= perTier * 2) return "Medium";
  return "Hard";
}
