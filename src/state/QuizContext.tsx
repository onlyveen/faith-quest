import { createContext, useCallback, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import {
  quizReducer,
  initialQuizState,
  type QuizState,
  type QuizAction,
} from "./quizReducer";
import {
  fetchQuizSet,
  markQuestionSeen,
  resetAllStatuses,
  NotEnoughQuestionsError,
} from "../services/airtable";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";

interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  loadQuestions: () => Promise<void>;
  markCurrentQuestionSeen: () => void;
  resetQuestionBank: () => Promise<number>;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const { language } = useLanguage();

  const currentTable =
    appConfig.languages.find((l) => l.code === language)?.table ??
    appConfig.languages[0].table;

  const loadQuestions = useCallback(async () => {
    dispatch({ type: "START_LOADING" });
    try {
      // Preview mode (?mock=1): plays through with placeholder questions so
      // the app can be tried/demoed before the Airtable bank is fully seeded.
      if (new URLSearchParams(window.location.search).get("mock") === "1") {
        const { mockQuizSet } = await import("../services/previewQuestions");
        dispatch({
          type: "QUESTIONS_LOADED",
          questions: mockQuizSet(),
          table: currentTable,
        });
        return;
      }
      const questions = await fetchQuizSet(currentTable);
      dispatch({ type: "QUESTIONS_LOADED", questions, table: currentTable });
    } catch (err) {
      const message =
        err instanceof NotEnoughQuestionsError
          ? err.message
          : "Could not load questions. Please check your connection and try again.";
      dispatch({ type: "LOAD_ERROR", message });
    }
  }, [currentTable]);

  const markCurrentQuestionSeen = useCallback(() => {
    const question = state.questions[state.currentIndex];
    if (!question) return;
    // Use the table the active question set was actually fetched from —
    // the player may have toggled the display language mid-quiz, which
    // must not repoint this at a different language's table.
    const table = state.questionsTable ?? currentTable;
    markQuestionSeen(table, question.id).catch((err) => {
      console.error("Failed to mark question as seen:", err);
    });
  }, [currentTable, state.questionsTable, state.questions, state.currentIndex]);

  const resetQuestionBank = useCallback(() => {
    return resetAllStatuses(currentTable);
  }, [currentTable]);

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        loadQuestions,
        markCurrentQuestionSeen,
        resetQuestionBank,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
}
