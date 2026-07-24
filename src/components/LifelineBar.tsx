import { motion } from "framer-motion";
import type { LifelineState } from "../types/question";
import type { Strings } from "../i18n/strings";

interface LifelineBarProps {
  lifelines: LifelineState;
  onUse: (key: keyof LifelineState) => void;
  t: Strings["lifelines"];
  disabledAll?: boolean;
}

const ICONS: Record<keyof LifelineState, string> = {
  fiftyFifty: "/50-50.png",
  askAudience: "/audience.png",
  graceGuess: "/grace.png",
};

export function LifelineBar({ lifelines, onUse, t, disabledAll }: LifelineBarProps) {
  const items: Array<{ key: keyof LifelineState; label: string }> = [
    { key: "fiftyFifty", label: t.fiftyFifty },
    { key: "askAudience", label: t.askAudience },
    { key: "graceGuess", label: t.graceGuess },
  ];

  return (
    <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-5">
      {items.map(({ key, label }, i) => {
        const available = lifelines[key] && !disabledAll;
        return (
          <motion.button
            key={key}
            onClick={() => onUse(key)}
            disabled={!available}
            title={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
            whileHover={available ? { scale: 1.05 } : undefined}
            whileTap={available ? { scale: 0.95 } : undefined}
            className={[
              "flex flex-col items-center gap-2 rounded-lg p-2",
              available ? "cursor-pointer" : "cursor-not-allowed grayscale opacity-50",
            ].join(" ")}
          >
            <img
              src={ICONS[key]}
              alt={label}
              className="h-[10rem] w-[10rem] object-contain sm:h-[12.5rem] sm:w-[12.5rem]"
            />
            <span className="text-center text-[clamp(1rem,5vw,1rem)] font-semibold text-white">
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
