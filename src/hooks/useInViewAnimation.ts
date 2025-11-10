"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewAnimationOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useInViewAnimation<T extends HTMLElement = HTMLDivElement>(options?: UseInViewAnimationOptions) {
  const { once = true, threshold = 0.2, root = null, rootMargin = "0px" } = options || {};
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observerInstance.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold, root, rootMargin]);

  return { ref: targetRef, isVisible };
}

