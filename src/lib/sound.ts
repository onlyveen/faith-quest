let audioCtx: AudioContext | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

interface ToneStep {
  freq: number;
  duration: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
}

function playTones(steps: ToneStep[]) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  let startAt = ctx.currentTime;
  for (const step of steps) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = step.type ?? "sine";
    osc.frequency.value = step.freq;

    const peak = step.gain ?? 0.2;
    const t0 = startAt + (step.delay ?? 0);
    const t1 = t0 + step.duration;

    gainNode.gain.setValueAtTime(0, t0);
    gainNode.gain.linearRampToValueAtTime(peak, t0 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t1);

    osc.connect(gainNode).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t1 + 0.05);

    startAt = t0;
  }
}

export const sound = {
  setMuted(value: boolean) {
    muted = value;
  },
  isMuted() {
    return muted;
  },
  /** Unlocks the AudioContext on first user gesture (autoplay policy). */
  unlock() {
    getContext();
  },
  tick() {
    playTones([{ freq: 880, duration: 0.06, type: "square", gain: 0.08 }]);
  },
  select() {
    playTones([{ freq: 520, duration: 0.08, type: "triangle", gain: 0.15 }]);
  },
  correct() {
    playTones([
      { freq: 523.25, duration: 0.14, type: "sine" },
      { freq: 659.25, duration: 0.14, delay: 0.12, type: "sine" },
      { freq: 783.99, duration: 0.22, delay: 0.24, type: "sine" },
    ]);
  },
  wrong() {
    playTones([
      { freq: 220, duration: 0.25, type: "sawtooth", gain: 0.18 },
      { freq: 164.81, duration: 0.35, delay: 0.15, type: "sawtooth", gain: 0.18 },
    ]);
  },
  lifelineUsed() {
    playTones([
      { freq: 440, duration: 0.1, type: "triangle" },
      { freq: 660, duration: 0.15, delay: 0.1, type: "triangle" },
    ]);
  },
  reveal() {
    playTones([
      { freq: 220, duration: 0.06, type: "square", gain: 0.12 },
      { freq: 440, duration: 0.06, delay: 0.05, type: "square", gain: 0.12 },
      { freq: 880, duration: 0.16, delay: 0.1, type: "sine", gain: 0.2 },
    ]);
  },
  milestone() {
    playTones([
      { freq: 523.25, duration: 0.15, type: "sine" },
      { freq: 659.25, duration: 0.15, delay: 0.14, type: "sine" },
      { freq: 783.99, duration: 0.15, delay: 0.28, type: "sine" },
      { freq: 1046.5, duration: 0.3, delay: 0.42, type: "sine" },
    ]);
  },
  win() {
    playTones([
      { freq: 523.25, duration: 0.18, type: "sine" },
      { freq: 659.25, duration: 0.18, delay: 0.16, type: "sine" },
      { freq: 783.99, duration: 0.18, delay: 0.32, type: "sine" },
      { freq: 1046.5, duration: 0.18, delay: 0.48, type: "sine" },
      { freq: 1318.5, duration: 0.5, delay: 0.64, type: "sine" },
    ]);
  },
  gameOver() {
    playTones([
      { freq: 392, duration: 0.3, type: "sawtooth", gain: 0.15 },
      { freq: 329.63, duration: 0.3, delay: 0.28, type: "sawtooth", gain: 0.15 },
      { freq: 261.63, duration: 0.5, delay: 0.56, type: "sawtooth", gain: 0.15 },
    ]);
  },
  timeUp() {
    playTones([
      { freq: 300, duration: 0.4, type: "square", gain: 0.15 },
    ]);
  },
};
