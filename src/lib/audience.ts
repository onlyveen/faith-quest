import type { Difficulty } from "../types/question";

const CORRECT_WEIGHT_RANGE: Record<Difficulty, [number, number]> = {
  Easy: [55, 75],
  Medium: [45, 65],
  Hard: [35, 55],
};

/**
 * Simulates an audience poll across the still-available options.
 * Returns a percentage (summing to 100) per option index; removed
 * options (from 50-50) are given 0.
 */
export function simulateAudiencePoll(
  optionCount: number,
  correctIndex: number,
  availableIndices: number[],
  difficulty: Difficulty,
): number[] {
  const result = new Array(optionCount).fill(0);
  const [min, max] = CORRECT_WEIGHT_RANGE[difficulty];
  const correctShare = Math.round(min + Math.random() * (max - min));
  result[correctIndex] = correctShare;

  const others = availableIndices.filter((i) => i !== correctIndex);
  let remaining = 100 - correctShare;

  others.forEach((idx, i) => {
    if (i === others.length - 1) {
      result[idx] = Math.max(0, remaining);
      return;
    }
    const share = Math.round(Math.random() * remaining * 0.6);
    result[idx] = share;
    remaining -= share;
  });

  return result;
}
