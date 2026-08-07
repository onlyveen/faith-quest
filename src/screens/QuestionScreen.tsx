import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GameplayBackground } from "../components/GameplayBackground";
import { GlossyButton } from "../components/GlossyButton";
import { OptionTile, type OptionState } from "../components/OptionTile";
import { Celebration } from "../components/Celebration";
import { TimerRing } from "../components/TimerRing";
import { LifelineBar } from "../components/LifelineBar";
import { Modal } from "../components/Modal";
import { PauseOverlay } from "./PauseOverlay";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useTimer } from "../hooks/useTimer";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { currentQuestionNumber } from "../state/quizReducer";
import { sound } from "../lib/sound";
import type { LifelineState } from "../types/question";

const LETTERS = ["A", "B", "C", "D"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function QuestionScreen() {
  const { t } = useLanguage();
  const { state, dispatch, markCurrentQuestionSeen } = useQuiz();
  const [lifelineFreeze, setLifelineFreeze] = useState(false);
  const [lifelinesModalOpen, setLifelinesModalOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [optionsRevealed, setOptionsRevealed] = useState(false);

  const question = state.questions[state.currentIndex];
  const qNum = currentQuestionNumber(state);
  const { current } = state;

  useEffect(() => {
    markCurrentQuestionSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex]);

  useEffect(() => {
    const id = setTimeout(() => {
      sound.reveal();
      setOptionsRevealed(true);
    }, 3000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex]);

  useEffect(() => {
    if (current.answerRevealed && current.isCorrect) {
      setCelebrate(true);
      const id = setTimeout(() => setCelebrate(false), 1800);
      return () => clearTimeout(id);
    }
  }, [current.answerRevealed, current.isCorrect]);

  const timerConfig = appConfig.timers[question.difficulty];
  const effectivePaused = state.isPaused || lifelineFreeze || lifelinesModalOpen;

  const { secondsLeft, percentLeft } = useTimer({
    totalSeconds: timerConfig.seconds,
    enabled: timerConfig.enabled && !current.answerRevealed && optionsRevealed,
    isPaused: effectivePaused,
    resetKey: state.currentIndex,
    onExpire: () => {
      sound.timeUp();
      dispatch({ type: "TIME_UP" });
    },
    onTick: (s) => {
      if (s > 0 && s <= 5) sound.tick();
    },
  });

  const freezeForLifeline = () => {
    setLifelineFreeze(true);
    setTimeout(() => setLifelineFreeze(false), 1200);
  };

  const selectOption = (idx: number) => {
    if (current.answerRevealed || current.disabledIndices.includes(idx)) return;
    sound.select();
    dispatch({ type: "SELECT_OPTION", index: idx });
  };

  const confirm = () => {
    if (current.selectedIndex === null || current.answerRevealed) return;
    if (current.selectedIndex === question.correctIndex) {
      sound.correct();
    } else {
      sound.wrong();
    }
    dispatch({ type: "CONFIRM_ANSWER" });
  };

  const proceed = () => dispatch({ type: "PROCEED_AFTER_REVEAL" });

  const useLifeline = (key: keyof LifelineState) => {
    if (!state.lifelines[key] || current.answerRevealed) return;
    sound.lifelineUsed();
    setLifelinesModalOpen(false);

    if (key === "fiftyFifty") {
      const available = [0, 1, 2, 3].filter(
        (i) => i !== question.correctIndex && !current.disabledIndices.includes(i),
      );
      const keep = available[Math.floor(Math.random() * available.length)];
      const removed = available.filter((i) => i !== keep);
      freezeForLifeline();
      dispatch({ type: "USE_FIFTY_FIFTY", removed });
    } else if (key === "askAudience") {
      freezeForLifeline();
      dispatch({ type: "USE_ASK_AUDIENCE" });
    } else {
      freezeForLifeline();
      dispatch({ type: "USE_GRACE_GUESS" });
    }
  };

  const graceRetryPending = current.graceGuessAttemptUsed && !current.answerRevealed;

  const inputBlocked = state.isPaused || lifelinesModalOpen || !optionsRevealed;

  useKeyboardShortcuts({
    "1": () => !inputBlocked && selectOption(0),
    "2": () => !inputBlocked && selectOption(1),
    "3": () => !inputBlocked && selectOption(2),
    "4": () => !inputBlocked && selectOption(3),
    Enter: () =>
      !inputBlocked && (current.answerRevealed ? proceed() : confirm()),
    " ": () => dispatch({ type: state.isPaused ? "RESUME" : "PAUSE" }),
    z: () => !inputBlocked && useLifeline("fiftyFifty"),
    x: () => !inputBlocked && useLifeline("askAudience"),
    c: () => !inputBlocked && useLifeline("graceGuess"),
  });

  function optionState(idx: number): OptionState {
    if (current.disabledIndices.includes(idx)) return "disabled";
    if (current.answerRevealed) {
      if (idx === question.correctIndex) return "correct";
      if (idx === current.selectedIndex) return "wrong";
      return "disabled";
    }
    if (idx === current.selectedIndex) return "selected";
    return "default";
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-4 py-8 text-center"
    >
      <GameplayBackground />
      <Celebration active={celebrate} intensity="small" />

      <motion.div
        variants={itemVariants}
        className="relative z-10 flex w-full max-w-3xl items-center justify-between"
      >
        <div className="flex flex-col items-start gap-1 text-left font-mono text-sm text-hud-cyan/80">
          <span>
            {t.preQuestion.questionLabel} {qNum} · {question.difficulty}
          </span>
          <span
            className="text-base leading-none tracking-wider"
            aria-label={`${state.hearts} of ${appConfig.maxHearts} hearts remaining`}
          >
            {Array.from({ length: appConfig.maxHearts }, (_, i) =>
              i < state.hearts ? "❤️" : "🤍",
            ).join(" ")}
          </span>
        </div>
        {timerConfig.enabled && (
          <TimerRing
            secondsLeft={secondsLeft}
            percentLeft={percentLeft}
            urgent={secondsLeft <= 5}
          />
        )}
        <GlossyButton
          variant="blue"
          onClick={() => setLifelinesModalOpen(true)}
          disabled={
            current.answerRevealed ||
            !optionsRevealed ||
            !Object.values(state.lifelines).some(Boolean)
          }
        >
          🛟 {t.lifelines.title}
        </GlossyButton>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        key={question.id}
        className="relative z-10 w-full max-w-3xl px-6 py-4 font-bold text-white text-[clamp(2rem,4vw,2.5rem)]"
      >
        {question.question}
      </motion.h1>

      {graceRetryPending && (
        <p className="relative z-10 font-semibold text-fq-gold-300">
          {t.lifelines.graceGuessTryAgain}
        </p>
      )}

      {optionsRevealed && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {question.options.map((opt, idx) => (
            <OptionTile
              key={`${question.id}-${idx}`}
              letter={LETTERS[idx]}
              text={opt}
              state={optionState(idx)}
              onClick={() => selectOption(idx)}
              index={idx}
            />
          ))}
        </motion.div>
      )}

      {lifelinesModalOpen && (
        <Modal
          title={t.lifelines.title}
          footer={
            <GlossyButton
              variant="purple"
              onClick={() => setLifelinesModalOpen(false)}
            >
              {t.lifelines.close}
            </GlossyButton>
          }
        >
          <LifelineBar
            lifelines={state.lifelines}
            onUse={useLifeline}
            t={t.lifelines}
            disabledAll={current.answerRevealed}
          />
        </Modal>
      )}

      {!current.answerRevealed && current.selectedIndex !== null && (
        <motion.div variants={itemVariants}>
          <GlossyButton variant="purple" onClick={confirm}>
            Next
          </GlossyButton>
        </motion.div>
      )}

      {current.answerRevealed && question.reference && (
        <motion.p
          variants={itemVariants}
          className="relative z-10 font-mono text-hud-cyan/80"
        >
          {t.question.referenceLabel} : {question.reference}
        </motion.p>
      )}

      {current.answerRevealed && (
        <motion.div variants={itemVariants}>
          <GlossyButton variant="purple" onClick={proceed}>
            Next
          </GlossyButton>
        </motion.div>
      )}

      {state.isPaused && <PauseOverlay />}
    </motion.div>
  );
}
