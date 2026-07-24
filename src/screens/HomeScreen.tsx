import { useState } from "react";
import { motion } from "framer-motion";
import { HeroBackground } from "../components/HeroBackground";
import { GlossyButton } from "../components/GlossyButton";
import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { sound } from "../lib/sound";
import type { LanguageCode } from "../i18n/strings";

export function HomeScreen() {
  const { setLanguage, t } = useLanguage();
  const { dispatch, resetQuestionBank } = useQuiz();
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);

  const chooseLanguage = (code: LanguageCode) => {
    sound.select();
    setLanguage(code);
    setSelectedLanguage(code);
  };

  const start = () => {
    sound.unlock();
    dispatch({ type: "GO_TO_PLAYER_SETUP" });
  };

  useKeyboardShortcuts({
    Enter: () => selectedLanguage && start(),
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

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-semibold tracking-wide text-white/70">
            {t.home.selectLanguage}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {appConfig.languages
              .filter((l) => l.enabled)
              .map((l) => (
                <motion.button
                  key={l.code}
                  onClick={() => chooseLanguage(l.code)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={[
                    "hud-cut-sm border-2 px-8 py-3 text-lg font-bold backdrop-blur-sm transition-colors",
                    selectedLanguage === l.code
                      ? "border-fq-gold-300 bg-fq-gold-300/15 text-fq-gold-300 hud-glow-gold"
                      : "border-white/25 bg-white/5 text-white/70 hover:border-white/50 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </motion.button>
              ))}
          </div>
        </div>

        {selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <GlossyButton variant="purple" onClick={start}>
              {t.home.start}
            </GlossyButton>
          </motion.div>
        )}

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
