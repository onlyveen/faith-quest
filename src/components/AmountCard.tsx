import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { appConfig } from "../config/appConfig";
import type { LadderTier } from "../lib/ladder";

const TIER_ICON: Record<LadderTier, string> = {
  steel: "",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
};

interface AmountCardProps {
  amount: number;
  tier: LadderTier;
  label?: string;
  size?: "xs" | "sm" | "lg";
}

const SIZE_TEXT: Record<"xs" | "sm" | "lg", string> = {
  xs: "text-[clamp(0.85rem,1.6vw,1rem)]",
  sm: "text-[clamp(1rem,2vw,1.3rem)]",
  lg: "text-[clamp(1.3rem,3vw,2rem)]",
};

export function AmountCard({ amount, tier, label, size = "lg" }: AmountCardProps) {
  // xs is plain text only — no card background, border, cut, or tier color.
  if (size === "xs") {
    return (
      <span className="inline-flex items-center gap-2">
        {label && (
          <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
            {label}
          </span>
        )}
        <span className={["flex items-center gap-2 font-mono font-bold", SIZE_TEXT.xs].join(" ")}>
          {appConfig.currency.symbol} <CountUp value={amount} />
        </span>
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`ladder-card ladder-card-${tier} hud-cut-sm flex flex-col items-center justify-center gap-1 px-6 py-4`}
    >
      {label && (
        <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
          {label}
        </span>
      )}
      <span
        className={[
          "ladder-card-amount flex items-center gap-2 font-mono font-bold",
          SIZE_TEXT[size],
        ].join(" ")}
      >
        {TIER_ICON[tier] && <span className="text-[0.85em]">{TIER_ICON[tier]}</span>}
        {appConfig.currency.symbol} <CountUp value={amount} />
      </span>
    </motion.div>
  );
}
