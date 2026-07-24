import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CelebrationProps {
  active: boolean;
  intensity?: "small" | "big";
}

const COLORS = ["#f5d98b", "#33f6ff", "#c98bf5", "#eef0f3", "#7ed321"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  width: number;
  height: number;
  drift: number;
}

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    duration: 1.3 + Math.random() * 1.1,
    rotate: (Math.random() - 0.5) * 720,
    color: COLORS[i % COLORS.length],
    width: 6 + Math.random() * 7,
    height: 10 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 160,
  }));
}

export function Celebration({ active, intensity = "small" }: CelebrationProps) {
  const count = intensity === "big" ? 100 : 34;
  const pieces = useMemo(() => makePieces(count), [count]);

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: "-10vh", x: 0, opacity: 1, rotate: 0 }}
              animate={{ y: "110vh", x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: 0,
                width: p.width,
                height: p.height,
                background: p.color,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
