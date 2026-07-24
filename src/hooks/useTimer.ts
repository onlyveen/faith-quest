import { useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  totalSeconds: number;
  enabled: boolean;
  isPaused: boolean;
  resetKey: string | number;
  onExpire: () => void;
  onTick?: (secondsLeft: number) => void;
}

export function useTimer({
  totalSeconds,
  enabled,
  isPaused,
  resetKey,
  onExpire,
  onTick,
}: UseTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  onExpireRef.current = onExpire;
  onTickRef.current = onTick;

  // Reset whenever we move to a new question.
  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [resetKey, totalSeconds]);

  useEffect(() => {
    if (!enabled || isPaused) return;
    if (secondsLeft <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
      onTickRef.current?.(secondsLeft - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [enabled, isPaused, secondsLeft]);

  return {
    secondsLeft,
    percentLeft: enabled ? Math.max(0, (secondsLeft / totalSeconds) * 100) : 100,
  };
}
