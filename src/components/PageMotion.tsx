import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
    >
      {children}
    </motion.div>
  );
}
