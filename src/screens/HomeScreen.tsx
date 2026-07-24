import { useState } from "react";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { sound } from "../lib/sound";

export function HomeScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { dispatch, resetQuestionBank } = useQuiz();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const start = () => {
    sound.unlock();
    dispatch({ type: "GO_TO_PLAYER_SETUP" });
  };

  useKeyboardShortcuts({
    Enter: start,
    r: async (e) => {
      if (!e.ctrlKey || !e.shiftKey) return;
      const count = await resetQuestionBank();
      setResetMessage(`Reset ${count} question(s) to unseen.`);
      setTimeout(() => setResetMessage(null), 4000);
    },
  });

  return (
    <div className="relative flex h-full min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <HeroBackground />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img
          src={appConfig.church.logoUrl}
          alt={appConfig.church.name}
          className="h-60 drop-shadow-lg"
        />


        <div className="flex gap-2">
          {appConfig.languages
            .filter((l) => l.enabled)
            .map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={[
                  "text-sm font-semibold transition-colors",
                  language === l.code
                    ? "border-fq-gold-300  text-fq-gold-300"
                    : "border-white/20 text-white/60 hover:text-white",
                ].join(" ")}
              >
                {l.label}
              </button>
            ))}
        </div>

        <GlossyButton variant="purple" onClick={start}>
          {t.home.start}
        </GlossyButton>

        <p className="text-xs text-white/30">{appConfig.church.name}</p>

        {resetMessage && (
          <p className="rounded-full bg-black/50 px-4 py-1 text-xs text-fq-gold-300">
            {resetMessage}
          </p>
        )}
      </div>
    </div>
  );
}
