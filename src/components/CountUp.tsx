import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 0.8, className }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const controls = animate(from, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
