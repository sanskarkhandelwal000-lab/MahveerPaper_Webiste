"use client";

import { useReducedMotion, motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type MotionSectionProps = HTMLMotionProps<"section"> & {
  delay?: number;
};

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, delay = 0, ...props }, ref) => {
    const prefersReduced = useReducedMotion();

    const variants = {
      hidden: prefersReduced ? {} : { opacity: 0, y: 22 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.section
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        variants={variants}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
);

MotionSection.displayName = "MotionSection";
