interface ProgressBarProps {
  percent: number;
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between font-mono text-[clamp(0.75rem,1.2vw,1rem)] text-hud-cyan/80">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-sm border border-hud-cyan/40 bg-black/40">
        <div
          className="hud-glow-cyan h-full rounded-sm bg-gradient-to-r from-hud-cyan-dim to-hud-cyan transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
