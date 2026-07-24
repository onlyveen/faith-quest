import { GameplayBackground } from "../components/GameplayBackground";
import { GlossyButton } from "../components/GlossyButton";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export function LoadingScreen() {
  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <GameplayBackground />
      <div className="relative z-10 h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-fq-gold-300" />
      <p className="relative z-10 text-lg text-white/70">Loading questions…</p>
    </div>
  );
}

export function LoadErrorScreen() {
  const { state, dispatch, loadQuestions } = useQuiz();

  const retry = () => void loadQuestions();
  const home = () => dispatch({ type: "GO_TO_HOME" });

  useKeyboardShortcuts({ Enter: retry, Escape: home });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <GameplayBackground />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-white/80">{state.loadError}</p>
        <div className="flex gap-3">
          <GlossyButton variant="blue" onClick={home}>
            Home
          </GlossyButton>
          <GlossyButton variant="purple" onClick={retry}>
            Retry
          </GlossyButton>
        </div>
      </div>
    </div>
  );
}
