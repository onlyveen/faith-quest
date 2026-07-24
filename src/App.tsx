import { AnimatePresence, motion } from "framer-motion";
import { LanguageProvider } from "./i18n/LanguageContext";
import { QuizProvider, useQuiz } from "./state/QuizContext";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayerSetupScreen } from "./screens/PlayerSetupScreen";
import { LadderIntroScreen } from "./screens/LadderIntroScreen";
import { LoadingScreen, LoadErrorScreen } from "./screens/StatusScreens";
import { PreQuestionScreen } from "./screens/PreQuestionScreen";
import { QuestionScreen } from "./screens/QuestionScreen";
import { MilestoneScreen } from "./screens/MilestoneScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

function renderScreen(screen: string) {
  switch (screen) {
    case "HOME":
      return <HomeScreen />;
    case "PLAYER_SETUP":
      return <PlayerSetupScreen />;
    case "LADDER_INTRO":
      return <LadderIntroScreen />;
    case "LOADING":
      return <LoadingScreen />;
    case "LOAD_ERROR":
      return <LoadErrorScreen />;
    case "PRE_QUESTION":
      return <PreQuestionScreen />;
    case "QUESTION":
      return <QuestionScreen />;
    case "MILESTONE":
      return <MilestoneScreen />;
    case "RESULTS":
      return <ResultsScreen />;
    default:
      return <HomeScreen />;
  }
}

function Screens() {
  const { state } = useQuiz();
  // Re-key per question so each question's pre-screen/question screen
  // gets its own enter/exit transition, not just top-level screen changes.
  const screenKey = `${state.screen}-${state.currentIndex}`;
  const isQuestion = state.screen === "QUESTION";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={isQuestion ? { opacity: 1 } : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className={isQuestion ? "glitch-enter" : ""}
      >
        {renderScreen(state.screen)}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QuizProvider>
        <div className="min-h-svh w-full bg-fq-bg-deep font-body text-white">
          <Screens />
        </div>
      </QuizProvider>
    </LanguageProvider>
  );
}

export default App;
