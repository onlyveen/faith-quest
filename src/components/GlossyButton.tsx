import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "purple" | "blue" | "silver" | "gold";

interface GlossyButtonProps {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

const variantClasses: Record<Variant, string> = {
  purple:
    "border-fq-purple-300 bg-gradient-to-b from-fq-purple-500/50 to-fq-purple-500/20 text-white hud-glow-purple",
  blue: "border-hud-cyan bg-gradient-to-b from-hud-cyan/25 to-fq-bg-light/40 text-white hud-glow-cyan",
  silver:
    "border-fq-silver-300 bg-gradient-to-b from-white/25 to-white/5 text-white hud-glow-cyan",
  gold: "border-fq-gold-300 bg-gradient-to-b from-fq-gold-300/40 to-fq-gold-500/20 text-fq-gold-300 hud-glow-gold",
};

export function GlossyButton({
  variant = "purple",
  fullWidth,
  children,
  disabled,
  onClick,
  type = "button",
}: GlossyButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.03, filter: "brightness(1.15)" }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={[
        "hud-cut-sm relative z-10 border-2 px-8 py-3 font-bold tracking-wide backdrop-blur-sm",
        "text-[clamp(0.9rem,1.6vw,1.3rem)]",
        fullWidth ? "w-full" : "",
        disabled
          ? "cursor-not-allowed border-white/15 bg-white/5 text-white/30"
          : "cursor-pointer",
        !disabled ? variantClasses[variant] : "",
      ].join(" ")}
    >
      {children}
    </motion.button>
  );
}
