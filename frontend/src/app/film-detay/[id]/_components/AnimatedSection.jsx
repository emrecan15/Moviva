"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
}) {
  const initialPosition = {
    up: { opacity: 0, y: 15 },
    down: { opacity: 0, y: -15 },
    left: { opacity: 0, x: -15 },
    right: { opacity: 0, x: 15 },
  };

  return (
    <motion.div
      initial={initialPosition[direction]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
