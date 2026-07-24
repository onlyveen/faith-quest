import DotField from "./DotField";

/** Calmer animated dot-field backdrop for in-game screens (question, loading, errors). */
export function GameplayBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-fq-bg-deep">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(51,246,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(51,246,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <DotField
        dotRadius={1.5}
        dotSpacing={20}
        cursorRadius={220}
        bulgeStrength={40}
        glowRadius={140}
        sparkle
        gradientFrom="rgba(51, 246, 255, 0.35)"
        gradientTo="rgba(201, 139, 245, 0.22)"
        glowColor="#33f6ff"
      />
      <div className="hud-scanline absolute inset-x-0 top-0 h-1/3" />
    </div>
  );
}
