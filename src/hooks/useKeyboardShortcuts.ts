import { useEffect, useRef } from "react";

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

/** Registers a contextual keyboard shortcut map. Pass a fresh object each render; identity doesn't matter. */
export function useKeyboardShortcuts(map: ShortcutMap, enabled = true) {
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    if (!enabled) return;

    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const fn = mapRef.current[key];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled]);
}
