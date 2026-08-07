import { appConfig } from "../config/appConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { sound } from "../lib/sound";

/** Persistent corner control so the display language can be changed from any screen. */
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="fixed right-3 top-3 z-40 flex gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-sm"
      role="group"
      aria-label={t.home.language}
    >
      {appConfig.languages
        .filter((l) => l.enabled)
        .map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => {
              if (l.code === language) return;
              sound.select();
              setLanguage(l.code);
            }}
            aria-pressed={l.code === language}
            className={[
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors",
              l.code === language
                ? "bg-fq-gold-300/20 text-fq-gold-300"
                : "text-white/50 hover:text-white",
            ].join(" ")}
          >
            {l.code}
          </button>
        ))}
    </div>
  );
}
