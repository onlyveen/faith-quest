import { motion } from "framer-motion";

export type OptionState = "default" | "selected" | "correct" | "wrong" | "disabled";

interface OptionTileProps {
  letter: string;
  text: string;
  state: OptionState;
  onClick: () => void;
  index?: number;
}

const stateClasses: Record<OptionState, string> = {
  default:
    "border-hud-cyan/70 bg-gradient-to-b from-hud-cyan/15 to-fq-bg-light/50 text-white hud-glow-cyan",
  selected:
    "border-fq-gold-300 bg-gradient-to-b from-fq-gold-300/30 to-fq-gold-500/15 text-white hud-glow-gold",
  correct:
    "border-fq-correct bg-gradient-to-b from-fq-correct/35 to-fq-correct/10 text-white",
  wrong: "border-hud-magenta bg-gradient-to-b from-hud-magenta/35 to-hud-magenta/10 text-white",
  disabled: "border-white/10 bg-white/5 text-white/20 pointer-events-none",
};

const GLOW: Partial<Record<OptionState, string>> = {
  correct: "hud-glow-cyan",
  wrong: "hud-glow-danger",
};

export function OptionTile({ letter, text, state, onClick, index = 0 }: OptionTileProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={state === "disabled"}
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: state === "disabled" ? 0.5 : 1,
        x: 0,
        scale: state === "correct" || state === "wrong" ? [1, 1.05, 1] : 1,
      }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      whileHover={state === "default" || state === "selected" ? { scale: 1.02 } : undefined}
      className={[
        "hud-cut-sm flex w-full items-start gap-3 border-2 px-6 py-3 text-left font-semibold backdrop-blur-sm",
        "text-[clamp(0.9rem,1.8vw,1.4rem)]",
        stateClasses[state],
        GLOW[state] ?? "",
      ].join(" ")}
    >
      <span className="hud-cut-sm mt-[0.1em] flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center bg-black/30 font-mono font-bold">
        {letter}
      </span>
      <span className="min-w-0 flex-1 break-words">{text}</span>
    </motion.button>
  );
}
