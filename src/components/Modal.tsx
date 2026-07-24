import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ title, children, footer }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hud-cut-lg hud-glow-cyan relative w-full max-w-5xl border-2 border-hud-cyan/70 bg-gradient-to-b from-fq-bg-light/95 to-fq-bg-deep/95 p-12 backdrop-blur-md"
      >
        <h2 className="mb-8 text-center font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold text-hud-cyan">
          {title}
        </h2>
        {children}
        {footer && <div className="mt-12 flex justify-center gap-3">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}
