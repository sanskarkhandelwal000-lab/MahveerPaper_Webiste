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
    up: { y: 32 },
    down: { y: -32 },
    left: { x: 32 },
    right: { x: -32 },
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
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
