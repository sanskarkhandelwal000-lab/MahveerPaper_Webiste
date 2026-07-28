"use client";

import { useReducedMotion, motion, type HTMLMotionProps } from "framer-motion";

type MotionDivProps = HTMLMotionProps<"div"> & {
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

export function MotionDiv({
  children,
  delay = 0,
  direction = "up",
  ...props
}: MotionDivProps) {
  const prefersReduced = useReducedMotion();

  const offsets = {
    up: { y: 22 },
    down: { y: -22 },
    left: { x: 22 },
    right: { x: -22 },
  };

  const variants = {
    hidden: prefersReduced ? {} : { opacity: 0, ...offsets[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      // Expo-out curve — a slow, graceful settle rather than the more
      // mechanical default ease, kept short enough to still feel immediate.
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
