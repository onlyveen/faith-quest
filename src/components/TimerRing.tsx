interface TimerRingProps {
  secondsLeft: number;
  percentLeft: number;
  urgent?: boolean;
}

export function TimerRing({ secondsLeft, percentLeft, urgent }: TimerRingProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentLeft / 100);

  return (
    <div
      className={[
        "relative h-20 w-20 shrink-0 rounded-full",
        urgent ? "drop-shadow-[0_0_10px_rgba(255,58,209,0.8)]" : "drop-shadow-[0_0_10px_rgba(51,246,255,0.6)]",
      ].join(" ")}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={urgent ? "#ff3ad1" : "#33f6ff"}
          strokeWidth="4"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span
        className={[
          "absolute inset-0 flex items-center justify-center font-mono text-xl font-bold",
          urgent ? "text-hud-magenta animate-pulse" : "text-hud-cyan",
        ].join(" ")}
      >
        {secondsLeft}
      </span>
    </div>
  );
}
