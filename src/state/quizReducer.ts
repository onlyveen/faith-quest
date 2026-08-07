import type { LifelineState, Question } from "../types/question";
import { amountForQuestion, getWalkAwayAmount } from "../lib/ladder";
import { appConfig } from "../config/appConfig";

// Airtable rows tend to have the correct answer authored into the same slot
// (often A/B), so shuffle each question's options at load time to spread the
// correct answer evenly across A-D — otherwise players learn to pattern-match.
function shuffleQuestionOptions(question: Question): Question {
  const order = question.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctIndex: order.indexOf(question.correctIndex),
  };
}

export type Screen =
  | "HOME"
  | "PLAYER_SETUP"
  | "LADDER_INTRO"
  | "LOADING"
  | "LOAD_ERROR"
  | "PRE_QUESTION"
  | "QUESTION"
  | "MILESTONE"
  | "RESULTS";

export interface CurrentQuestionState {
  selectedIndex: number | null;
  disabledIndices: number[]; // removed by 50-50 or eliminated by a wrong grace-guess attempt
  answerRevealed: boolean;
  isCorrect: boolean | null;
  graceGuessActive: boolean;
  graceGuessAttemptUsed: boolean;
}

export interface QuizState {
  screen: Screen;
  playerName: string;
  questions: Question[];
  currentIndex: number; // 0-based
  mannaEarned: number; // locked-in amount from last correctly answered question
  lastCorrectQuestionNumber: number; // 1-based
  lifelines: LifelineState;
  current: CurrentQuestionState;
  gameResult: "WON" | "LOST" | "EXITED" | null;
  loadError: string | null;
  isPaused: boolean;
  hearts: number; // remaining lives; game ends when this hits 0
  questionsTable: string | null; // Airtable table the active question set was fetched from
}

const initialCurrentQuestion: CurrentQuestionState = {
  selectedIndex: null,
  disabledIndices: [],
  answerRevealed: false,
  isCorrect: null,
  graceGuessActive: false,
  graceGuessAttemptUsed: false,
};

export const initialQuizState: QuizState = {
  screen: "HOME",
  playerName: "",
  questions: [],
  currentIndex: 0,
  mannaEarned: 0,
  lastCorrectQuestionNumber: 0,
  lifelines: { fiftyFifty: true, askAudience: true, graceGuess: true },
  current: initialCurrentQuestion,
  gameResult: null,
  loadError: null,
  isPaused: false,
  hearts: appConfig.maxHearts,
  questionsTable: null,
};

export type QuizAction =
  | { type: "GO_TO_HOME" }
  | { type: "GO_TO_PLAYER_SETUP" }
  | { type: "SET_PLAYER_NAME"; name: string }
  | { type: "GO_TO_LADDER" }
  | { type: "START_LOADING" }
  | { type: "QUESTIONS_LOADED"; questions: Question[]; table: string }
  | { type: "LOAD_ERROR"; message: string }
  | { type: "ENTER_QUESTION" }
  | { type: "SELECT_OPTION"; index: number }
  | { type: "USE_FIFTY_FIFTY"; removed: number[] }
  | { type: "USE_ASK_AUDIENCE" }
  | { type: "USE_GRACE_GUESS" }
  | { type: "CONFIRM_ANSWER" }
  | { type: "PROCEED_AFTER_REVEAL" }
  | { type: "CONTINUE_AFTER_MILESTONE" }
  | { type: "EXIT_WITH_WINNINGS" }
  | { type: "TIME_UP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESTART" };

export function currentQuestionNumber(state: QuizState): number {
  return state.currentIndex + 1;
}

function evaluateAnswer(state: QuizState, selectedIndex: number): QuizState {
  const question = state.questions[state.currentIndex];
  const isCorrect = selectedIndex === question.correctIndex;
  const qNum = currentQuestionNumber(state);

  if (isCorrect) {
    return {
      ...state,
      mannaEarned: amountForQuestion(qNum),
      lastCorrectQuestionNumber: qNum,
      current: {
        ...state.current,
        selectedIndex,
        answerRevealed: true,
        isCorrect: true,
      },
    };
  }

  // Wrong answer — Grace Guess forgives exactly one wrong pick per question.
  if (state.current.graceGuessActive && !state.current.graceGuessAttemptUsed) {
    return {
      ...state,
      current: {
        ...state.current,
        selectedIndex: null,
        disabledIndices: [...state.current.disabledIndices, selectedIndex],
        graceGuessAttemptUsed: true,
      },
    };
  }

  return {
    ...state,
    current: {
      ...state.current,
      selectedIndex,
      answerRevealed: true,
      isCorrect: false,
    },
  };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "GO_TO_HOME":
      return { ...initialQuizState, screen: "HOME" };

    case "GO_TO_PLAYER_SETUP":
      return { ...initialQuizState, screen: "PLAYER_SETUP" };

    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.name };

    case "GO_TO_LADDER":
      return { ...state, screen: "LADDER_INTRO" };

    case "START_LOADING":
      return { ...state, screen: "LOADING", loadError: null };

    case "QUESTIONS_LOADED":
      return {
        ...state,
        screen: "PRE_QUESTION",
        questions: action.questions.map(shuffleQuestionOptions),
        currentIndex: 0,
        questionsTable: action.table,
      };

    case "LOAD_ERROR":
      return { ...state, screen: "LOAD_ERROR", loadError: action.message };

    case "ENTER_QUESTION":
      return {
        ...state,
        screen: "QUESTION",
        current: initialCurrentQuestion,
        isPaused: false,
      };

    case "SELECT_OPTION":
      if (state.current.answerRevealed) return state;
      return {
        ...state,
        current: { ...state.current, selectedIndex: action.index },
      };

    case "USE_FIFTY_FIFTY":
      if (!state.lifelines.fiftyFifty) return state;
      return {
        ...state,
        lifelines: { ...state.lifelines, fiftyFifty: false },
        current: {
          ...state.current,
          disabledIndices: [
            ...state.current.disabledIndices,
            ...action.removed,
          ],
        },
      };

    case "USE_ASK_AUDIENCE":
      if (!state.lifelines.askAudience) return state;
      return {
        ...state,
        lifelines: { ...state.lifelines, askAudience: false },
      };

    case "USE_GRACE_GUESS":
      if (!state.lifelines.graceGuess) return state;
      return {
        ...state,
        lifelines: { ...state.lifelines, graceGuess: false },
        current: { ...state.current, graceGuessActive: true },
      };

    case "CONFIRM_ANSWER": {
      if (state.current.selectedIndex === null || state.current.answerRevealed) {
        return state;
      }
      return evaluateAnswer(state, state.current.selectedIndex);
    }

    case "TIME_UP": {
      if (state.current.answerRevealed) return state;
      // No selection made — always a miss, even under an active Grace Guess.
      return {
        ...state,
        current: {
          ...state.current,
          answerRevealed: true,
          isCorrect: false,
        },
      };
    }

    case "PROCEED_AFTER_REVEAL": {
      const wasWrong = state.current.isCorrect === false;
      const hearts = wasWrong ? state.hearts - 1 : state.hearts;
      const isLastQuestion =
        currentQuestionNumber(state) >= appConfig.ladder.length;

      // Out of hearts, or a wrong answer with no questions left — game over.
      if (wasWrong && (hearts <= 0 || isLastQuestion)) {
        return {
          ...state,
          hearts,
          screen: "RESULTS",
          gameResult: "LOST",
          mannaEarned: getWalkAwayAmount(state.lastCorrectQuestionNumber),
        };
      }
      if (isLastQuestion) {
        return { ...state, hearts, screen: "RESULTS", gameResult: "WON" };
      }
      if (appConfig.checkpoints.includes(currentQuestionNumber(state))) {
        return { ...state, hearts, screen: "MILESTONE" };
      }
      return {
        ...state,
        hearts,
        screen: "PRE_QUESTION",
        currentIndex: state.currentIndex + 1,
        current: initialCurrentQuestion,
      };
    }

    case "CONTINUE_AFTER_MILESTONE":
      if (state.screen !== "MILESTONE") return state;
      return {
        ...state,
        screen: "PRE_QUESTION",
        currentIndex: state.currentIndex + 1,
        current: initialCurrentQuestion,
      };

    case "EXIT_WITH_WINNINGS":
      if (state.screen !== "MILESTONE") return state;
      return { ...state, screen: "RESULTS", gameResult: "EXITED" };

    case "PAUSE":
      return { ...state, isPaused: true };

    case "RESUME":
      return { ...state, isPaused: false };

    case "RESTART":
      return { ...initialQuizState, screen: "PLAYER_SETUP" };

    default:
      return state;
  }
}
