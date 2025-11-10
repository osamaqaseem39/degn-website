"use client";

import { useEffect, useState, useRef } from "react";

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateScrollProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;
      
      // Calculate scroll progress: 0 when element is below viewport, 1 when above
      // As element scrolls from bottom to top of viewport, progress goes 0 -> 1
      const viewportBottom = windowHeight;
      
      // Element enters from bottom: elementTop starts at windowHeight
      // Element exits from top: elementTop + elementHeight = 0
      // Range is windowHeight + elementHeight
      const totalRange = windowHeight + elementHeight;
      const currentPosition = viewportBottom - elementTop;
      
      let progress = currentPosition / totalRange;
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
      
      // Only update state if progress changed significantly (reduce re-renders)
      if (Math.abs(progress - lastProgressRef.current) > 0.001) {
        lastProgressRef.current = progress;
        setScrollProgress(progress);
      }
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(updateScrollProgress);
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Update on scroll with RAF throttling
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { scrollProgress, elementRef };
}

