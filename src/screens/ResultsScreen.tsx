import { useEffect, useState } from "react";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { AmountCard } from "../components/AmountCard";
import { Celebration } from "../components/Celebration";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { tierForQuestion } from "../lib/ladder";
import { sound } from "../lib/sound";

export function ResultsScreen() {
  const { t } = useLanguage();
  const { state, dispatch } = useQuiz();
  const won = state.gameResult === "WON";
  const exited = state.gameResult === "EXITED";
  const [celebrate, setCelebrate] = useState(won);

  useEffect(() => {
    if (won || exited) sound.win();
    else sound.gameOver();
    if (won) {
      const id = setTimeout(() => setCelebrate(false), 3200);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAgain = () => dispatch({ type: "RESTART" });
  const home = () => dispatch({ type: "GO_TO_HOME" });

  useKeyboardShortcuts({ Enter: playAgain, Escape: home });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <HeroBackground variant={won || exited ? "gold" : "default"} />
      <Celebration active={celebrate} intensity="big" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="font-display text-[clamp(2rem,6vw,4rem)] font-bold">
          {won ? t.results.won : exited ? t.results.exited : t.results.gameOver}
        </h1>
        <p className="text-white/70">{state.playerName}</p>

        <AmountCard
          amount={state.mannaEarned}
          tier={tierForQuestion(state.lastCorrectQuestionNumber)}
        />

        <p className="text-white/60">
          {t.results.correctCount}: {state.lastCorrectQuestionNumber} /{" "}
          {appConfig.ladder.length}
        </p>

        <div className="mt-4 flex gap-3">
          <GlossyButton variant="blue" onClick={home}>
            {t.results.home}
          </GlossyButton>
          <GlossyButton variant="purple" onClick={playAgain}>
            {t.results.playAgain}
          </GlossyButton>
        </div>
      </div>
    </div>
  );
}
