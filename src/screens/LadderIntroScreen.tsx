import { motion } from "framer-motion";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { tierForQuestion, type LadderTier } from "../lib/ladder";

const TIER_ICON: Record<LadderTier, string> = {
  steel: "",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
};

export function LadderIntroScreen() {
  const { t } = useLanguage();
  const { dispatch, loadQuestions } = useQuiz();

  const start = () => {
    void loadQuestions();
  };

  useKeyboardShortcuts({
    Enter: start,
    Escape: () => dispatch({ type: "GO_TO_HOME" }),
  });

  const ladder = appConfig.ladder;
  const perTier = appConfig.questionsPerDifficulty;
  const columns = [
    ladder.slice(0, perTier),
    ladder.slice(perTier, perTier * 2),
    ladder.slice(perTier * 2, perTier * 3),
  ];

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <HeroBackground />
      <h1 className="relative z-10 font-display text-[clamp(1.6rem,4vw,2.5rem)] font-bold">
        {t.ladder.title}
      </h1>

      <div className="relative z-10 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-5">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-5">
            {col.map((amount, i) => {
              const qNum = colIdx * perTier + i + 1;
              const tier = tierForQuestion(qNum);
              return (
                <motion.div
                  key={qNum}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: qNum * 0.025, ease: "easeOut" }}
                  className={`ladder-card ladder-card-${tier} hud-cut-sm flex items-center justify-center gap-2 p-5 font-mono text-[clamp(1.6rem,3vw,2.5rem)] font-bold`}
                >
                  {TIER_ICON[tier] && <span className="text-[0.75em]">{TIER_ICON[tier]}</span>}
                  <span className="ladder-card-amount">
                    Q{qNum} · {appConfig.currency.symbol} {amount.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <GlossyButton variant="purple" onClick={start}>
        {t.ladder.cta}
      </GlossyButton>
    </div>
  );
}
