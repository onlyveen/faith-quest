import type { Difficulty } from "../types/question";

export interface LanguageConfig {
  code: "te" | "en" | "kn";
  label: string;
  /** Airtable table name holding this language's question bank. */
  table: string;
  enabled: boolean;
}

export interface DifficultyTimerConfig {
  seconds: number;
  enabled: boolean;
}

export const appConfig = {
  appName: "FaithQuest",
  tagline: {
    te: "బైబిల్ క్విజ్",
    en: "The Bible Quiz Show",
    kn: "ಬೈಬಲ್ ಕ್ವಿಜ್",
  },

  // White-label branding — swap per church deployment.
  church: {
    name: "A to J Good News Telugu Church",
    logoUrl: "/logo.svg",
    primaryColor: "#2f6fe4",
    accentColor: "#a239e0",
  },

  currency: {
    name: "Manna",
    symbol: "❆",
  },

  // Fixed 15-step Manna ladder (matches classic Millionaire progression).
  ladder: [
    100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
    250000, 500000, 1000000,
  ] as const,

  // 1-based question numbers that lock in a guaranteed minimum payout.
  checkpoints: [5, 10] as number[],

  // Wrong answers cost a heart; the game ends once all hearts are lost.
  maxHearts: 3,

  questionsPerDifficulty: 5,

  difficultyOrder: ["Easy", "Medium", "Hard"] as Difficulty[],

  timers: {
    Easy: { seconds: 60, enabled: true },
    Medium: { seconds: 120, enabled: true },
    Hard: { seconds: 300, enabled: false },
  } as Record<Difficulty, DifficultyTimerConfig>,

  lifelines: {
    fiftyFifty: true,
    askAudience: true,
    graceGuess: true,
  },

  languages: [
    { code: "te", label: "తెలుగు", table: "Questions Telugu", enabled: true },
    {
      code: "en",
      label: "English",
      table: "Questions English",
      enabled: true,
    },
    {
      code: "kn",
      label: "ಕನ್ನಡ",
      table: "Questions Kannada",
      enabled: true,
    },
  ] as LanguageConfig[],

  defaultLanguage: "te" as LanguageConfig["code"],
};

export type AppConfig = typeof appConfig;
