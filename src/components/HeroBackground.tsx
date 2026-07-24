import { lazy, Suspense } from "react";

const LightPillar = lazy(() => import("./LightPillar"));

interface HeroBackgroundProps {
  variant?: "default" | "gold";
}

/** Ambient volumetric light-pillar backdrop for ceremonial screens (home, ladder, results). */
export function HeroBackground({ variant = "default" }: HeroBackgroundProps) {
  const [topColor, bottomColor] =
    variant === "gold" ? ["#f5d98b", "#e0a530"] : ["#c98bf5", "#2f6fe4"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-fq-bg-deep">
      <Suspense fallback={null}>
        <LightPillar
          topColor={topColor}
          bottomColor={bottomColor}
          intensity={0.9}
          rotationSpeed={0.15}
          glowAmount={0.0035}
          pillarWidth={2.4}
          pillarHeight={0.35}
          noiseIntensity={0.35}
          mixBlendMode="screen"
          quality="medium"
        />
      </Suspense>
      {/* Vignette keeps foreground text readable over the bright pillar core. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(21,12,61,0.15)_0%,rgba(21,12,61,0.85)_75%)]" />
      <div className="hud-scanline absolute inset-x-0 top-0 h-1/3" />
    </div>
  );
}
