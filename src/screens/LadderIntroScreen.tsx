import { motion } from "framer-motion";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

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

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <HeroBackground />
      <h1 className="relative z-10 font-display text-[clamp(1.6rem,4vw,2.5rem)] font-bold">
        {t.ladder.title}
      </h1>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-3 text-left sm:max-w-[56rem] sm:gap-6">
        <h2 className="text-center font-display text-lg font-bold text-fq-gold-300 sm:text-[2.25rem]">
          {t.ladder.howToPlayTitle}
        </h2>
        <ol className="flex flex-col gap-2 text-sm text-white/80 sm:gap-4 sm:text-[1.75rem]">
          {t.ladder.howToPlay.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
              className="flex gap-2 sm:gap-4"
            >
              <span className="font-mono font-bold text-hud-cyan">{i + 1}.</span>
              <span>{step}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <GlossyButton variant="purple" onClick={start}>
        {t.ladder.cta}
      </GlossyButton>
    </div>
  );
}
