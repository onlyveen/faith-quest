import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type HudVariant = "none" | "cyan" | "purple" | "gold" | "silver" | "danger";
type HudCut = "none" | "sm" | "md" | "lg";

interface HudPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: HudVariant;
  cut?: HudCut;
  brackets?: boolean;
  glow?: boolean;
  children: ReactNode;
}

const VARIANT_BORDER: Record<HudVariant, string> = {
  cyan: "border-hud-cyan/70",
  purple: "border-fq-purple-300/70",
  gold: "border-fq-gold-300/80",
  silver: "border-fq-silver-300/70",
  danger: "border-hud-magenta/70",
  none: "transparent"
};

const VARIANT_GLOW: Record<HudVariant, string> = {
  cyan: "hud-glow-cyan",
  purple: "hud-glow-purple",
  gold: "hud-glow-gold",
  silver: "hud-glow-cyan",
  danger: "hud-glow-danger",
  none: "transparent"
};

const VARIANT_BRACKET: Record<HudVariant, string> = {
  cyan: "border-hud-cyan",
  purple: "border-fq-purple-300",
  gold: "border-fq-gold-300",
  silver: "border-fq-silver-300",
  danger: "border-hud-magenta",
  none: "transparent"
};

const CUT_CLASS: Record<HudCut, string> = {
  none: "transparent",
  sm: "hud-cut-sm",
  md: "hud-cut-md",
  lg: "hud-cut-lg",
};

function CornerBrackets({ variant }: { variant: HudVariant }) {
  const base = `pointer-events-none absolute h-3 w-3 ${VARIANT_BRACKET[variant]}`;
  return (
    <>
      <span className={`${base} -left-1 -top-1 border-l-2 border-t-2`} />
      <span className={`${base} -right-1 -top-1 border-r-2 border-t-2`} />
      <span className={`${base} -bottom-1 -left-1 border-b-2 border-l-2`} />
      <span className={`${base} -bottom-1 -right-1 border-b-2 border-r-2`} />
    </>
  );
}

export function HudPanel({
  variant = "cyan",
  cut = "md",
  brackets = true,
  glow = true,
  className = "",
  children,
  ...rest
}: HudPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={[
        `relative z-10 ${variant != "none" ? "border-2 bg-fq-bg-light/60 bg-fq-bg-light/0 backdrop-blur-sm " : ""} `,
        CUT_CLASS[cut],
        VARIANT_BORDER[variant],
        glow ? VARIANT_GLOW[variant] : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {brackets && <CornerBrackets variant={variant} />}
      {children}
    </motion.div>
  );
}
