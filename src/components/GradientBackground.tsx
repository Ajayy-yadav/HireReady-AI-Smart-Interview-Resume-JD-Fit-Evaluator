"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  animate?: boolean;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  className,
  animate = true,
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !gradientRef.current) return;

    try {
      gsap.fromTo(
        gradientRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" }
      );
    } catch (error) {
      // Fallback if GSAP is not installed - just show the gradient
      if (gradientRef.current) {
        gradientRef.current.style.opacity = "1";
      }
    }
  }, [animate]);

  return (
    <div
      ref={gradientRef}
      className={cn(
        "absolute inset-0 -z-10 transition-colors duration-700",
        className
      )}
      style={{
        background: `
          linear-gradient(180deg, 
            rgba(255, 255, 255, 1) 0%, 
            rgba(255, 237, 213, 0.9) 25%, 
            rgba(255, 218, 185, 0.8) 50%, 
            rgba(255, 182, 193, 0.7) 70%, 
            rgba(224, 187, 228, 0.6) 85%, 
            rgba(243, 229, 245, 0.5) 100%
          ),
          radial-gradient(at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%),
          radial-gradient(at 80% 70%, rgba(243, 229, 245, 0.3) 0%, transparent 70%)
        `,
      }}
    />
  );
};
