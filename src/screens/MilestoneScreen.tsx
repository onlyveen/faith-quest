import { useEffect, useState } from "react";
import { GameplayBackground } from "../components/GameplayBackground";
import { GlossyButton } from "../components/GlossyButton";
import { HudPanel } from "../components/HudPanel";
import { AmountCard } from "../components/AmountCard";
import { Celebration } from "../components/Celebration";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { currentQuestionNumber } from "../state/quizReducer";
import { difficultyForQuestion, tierForQuestion } from "../lib/ladder";
import { sound } from "../lib/sound";

export function MilestoneScreen() {
  const { t } = useLanguage();
  const { state, dispatch } = useQuiz();
  const [celebrate, setCelebrate] = useState(true);

  useEffect(() => {
    sound.milestone();
    const id = setTimeout(() => setCelebrate(false), 3000);
    return () => clearTimeout(id);
  }, []);

  const nextQNum = currentQuestionNumber(state) + 1;
  const nextDifficulty = difficultyForQuestion(nextQNum);
  const nextTimer = appConfig.timers[nextDifficulty];

  const continuePlaying = () => {
    sound.select();
    dispatch({ type: "CONTINUE_AFTER_MILESTONE" });
  };

  const exitWithWinnings = () => dispatch({ type: "EXIT_WITH_WINNINGS" });

  useKeyboardShortcuts({ Enter: continuePlaying, Escape: exitWithWinnings });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <GameplayBackground />
      <Celebration active={celebrate} intensity="big" />
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        <h1 className="font-display text-[clamp(1.6rem,4vw,2.3rem)] font-bold text-fq-gold-300">
          {t.milestone.title}
        </h1>

        <AmountCard
          amount={state.mannaEarned}
          tier={tierForQuestion(state.lastCorrectQuestionNumber)}
          label={t.milestone.lockedInLabel}
        />

        <HudPanel variant="cyan" cut="sm" className="w-full px-6 py-4 text-left">
          <p className="mb-2 text-sm font-semibold text-hud-cyan">
            {t.milestone.ruleChangeIntro}
          </p>
          <div className="flex justify-between text-sm text-white/80">
            <span>{t.milestone.difficultyLabel}</span>
            <span className="font-bold">{nextDifficulty}</span>
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>{t.milestone.timeLabel}</span>
            <span className="font-bold">
              {nextTimer.enabled ? `${nextTimer.seconds}s` : t.milestone.unlimitedTime}
            </span>
          </div>
        </HudPanel>

        <div className="flex flex-wrap justify-center gap-3">
          <GlossyButton variant="blue" onClick={exitWithWinnings}>
            {t.milestone.exitCta}
          </GlossyButton>
          <GlossyButton variant="purple" onClick={continuePlaying}>
            {t.milestone.continueCta}
          </GlossyButton>
        </div>
      </div>
    </div>
  );
}
