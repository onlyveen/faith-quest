import { GameplayBackground } from "../components/GameplayBackground";
import { GlossyButton } from "../components/GlossyButton";
import { AmountCard } from "../components/AmountCard";
import { ProgressBar } from "../components/ProgressBar";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { currentQuestionNumber } from "../state/quizReducer";
import { amountForQuestion, percentComplete, tierForQuestion } from "../lib/ladder";
import { sound } from "../lib/sound";

export function PreQuestionScreen() {
  const { t } = useLanguage();
  const { state, dispatch } = useQuiz();

  const qNum = currentQuestionNumber(state);
  const total = appConfig.ladder.length;
  const percent = percentComplete(qNum, total);
  const nextAmount = amountForQuestion(qNum);

  const enter = () => {
    sound.select();
    dispatch({ type: "ENTER_QUESTION" });
  };

  useKeyboardShortcuts({ Enter: enter });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <GameplayBackground />
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        <p className="font-mono text-[clamp(1.2rem,2.5vw,1.5rem)] font-bold tracking-wide text-hud-cyan">
          {t.preQuestion.questionLabel} {qNum} {t.preQuestion.of} {total}
        </p>

        <AmountCard amount={nextAmount} tier={tierForQuestion(qNum)} />

        <div className="w-full">
          <div className="mt-4">
            <ProgressBar percent={percent} label={t.preQuestion.complete} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <p className=" text-white/70">{t.preQuestion.earnedSoFar}</p>
            <AmountCard
              amount={state.mannaEarned}
              tier={tierForQuestion(state.lastCorrectQuestionNumber)}
              size="xs"
            />
          </div>
        </div>

        <GlossyButton variant="purple" onClick={enter}>
          {t.preQuestion.cta}
        </GlossyButton>
      </div>
    </div>
  );
}
