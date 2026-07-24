import { useState } from "react";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export function PlayerSetupScreen() {
  const { t } = useLanguage();
  const { dispatch } = useQuiz();
  const [name, setName] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({ type: "SET_PLAYER_NAME", name: trimmed });
    dispatch({ type: "GO_TO_LADDER" });
  };

  useKeyboardShortcuts({
    Enter: submit,
    Escape: () => dispatch({ type: "GO_TO_HOME" }),
  });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <HeroBackground />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <h1 className="font-display text-[clamp(1.6rem,4vw,2.5rem)] font-bold">
          {t.playerSetup.title}
        </h1>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t.playerSetup.placeholder}
          className="w-full rounded-full border-2 border-fq-blue-300/50 bg-white/10 px-6 py-3 text-center text-lg text-white placeholder-white/40 outline-none focus:border-fq-gold-300"
        />
        <GlossyButton
          variant="purple"
          onClick={submit}
          disabled={!name.trim()}
        >
          {t.playerSetup.cta}
        </GlossyButton>
      </div>
    </div>
  );
}
