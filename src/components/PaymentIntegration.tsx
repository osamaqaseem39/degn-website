"use client";

import ThreeScene from "./ThreeScene";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function PaymentIntegration() {
  const { scrollProgress, elementRef } = useScrollProgress();
  const modelColumnRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const { ref: textRef, isVisible: textVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: modelRef, isVisible: modelVisible } = useInViewAnimation<HTMLDivElement>();

  const setModelRefs = useCallback((node: HTMLDivElement | null) => {
    modelColumnRef.current = node;
    modelRef.current = node;
  }, [modelRef]);

  // Detect mobile (typically < 768px for md breakpoint)
  const isMobile = windowWidth > 0 && windowWidth < 768;

  // Track window width for responsive behavior
  useEffect(() => {
    let ticking = false;
    let lastWidth = window.innerWidth;
    
    const updateWidth = () => {
      const newWidth = window.innerWidth;
      if (Math.abs(newWidth - lastWidth) > 50) {
        lastWidth = newWidth;
        setWindowWidth(newWidth);
      }
      ticking = false;
    };

    const throttledUpdateWidth = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateWidth);
      }
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", throttledUpdateWidth, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledUpdateWidth);
    };
  }, []);

  // Update container rect for positioning
  useEffect(() => {
    let ticking = false;
    let lastUpdateTime = 0;
    const throttleMs = 16;
    
    const updateContainerRect = () => {
      const el = modelColumnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setContainerRect(prev => {
        if (prev.top === rect.top && prev.left === rect.left && 
            prev.width === rect.width && prev.height === rect.height) {
          return prev;
        }
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      });
      ticking = false;
    };

    const updateOnScroll = () => {
      const now = performance.now();
      if (!ticking && (now - lastUpdateTime) >= throttleMs) {
        ticking = true;
        lastUpdateTime = now;
        requestAnimationFrame(updateContainerRect);
      }
    };

    updateContainerRect();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateContainerRect);
    
    return () => {
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateContainerRect);
    };
  }, []);
  return (
    <section ref={elementRef} className="relative overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12">
          {/* Visual column (50%) - moved to left with phone model - takes space on desktop for Hero model, but model only visible on mobile */}
          <div ref={setModelRefs} className={`order-2 md:order-1 md:col-span-6 w-full h-[500px] md:h-[600px] relative transition-all duration-700 ease-out ${modelVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* Glow effect behind 3D model - hidden on desktop */}
            <div className="absolute inset-0 flex items-center justify-center -translate-x-8 block md:hidden">
              <div className="h-[400px] w-[300px] md:h-[500px] md:w-[350px] rounded-full bg-[#0013FF]/20 blur-3xl" />
              <div className="absolute h-[250px] w-[200px] md:h-[300px] md:w-[250px] rounded-full bg-pink-500/10 blur-2xl" />
            </div>
            {/* Second model (Phone_3.glb) - only visible on mobile */}
            {containerRect.width > 0 && containerRect.height > 0 && (
              <div
                className={`${isMobile ? "absolute inset-0 z-[1099] pointer-events-none" : "fixed z-[1099] pointer-events-none"} block md:hidden`}
                style={isMobile ? {} : {
                  top: containerRect.top,
                  left: containerRect.left,
                  width: containerRect.width,
                  height: containerRect.height,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ThreeScene
                    modelPath="/images/Phone_3.glb"
                    noLights={false}
                    scrollProgress={isMobile ? undefined : scrollProgress}
                    enableScrollAnimation={!isMobile}
                    autoRotate={isMobile}
                    rotationSpeed={isMobile ? 0.2 : undefined}
                    semiRotate={isMobile}
                    scaleMultiplier={1.5}
                    initialRotation={[0, -0.3, -0.45]}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Text column (50%) - moved to right */}
          <div ref={textRef} className={`order-1 md:order-2 md:col-span-6 text-center md:text-right transition-all duration-700 ease-out ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="block text-[14px] md:text-[24px] leading-[1.4] tracking-[0.02em] font-light" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
          Over 500 Payment Providers
            </span>
            
            <h2 className="text-white mb-6 text-center md:text-right">
              <span className="block text-[20px] md:text-[36px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                SEAMLESS LOCAL
              </span>
              <span className="block text-[20px] md:text-[36px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                PAYMENT INTEGRATION
              </span>
            </h2>

            <p className="text-white/80 text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400 }}>
              Deposit funds instantly in your local currency with support for 15+ major payment methods across Asia & Europe.
            </p>

            {/* Payment method cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {/* Europe */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/downloadicon.png"
                    alt="Download icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    EUROPE:
                  </h3>
                  <p className="text-white text-sm md:text-base">SEPA, IDEAL, SOFORT, And +</p>
                </div>
              </div>

              {/* Asia */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/downloadicon.png"
                    alt="Download icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    ASIA:
                  </h3>
                  <p className="text-white text-sm md:text-base">WeChat Pay, Alipay, GrabPay, And +</p>
                </div>
              </div>

              {/* Global */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/downloadicon.png"
                    alt="Download icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    GLOBAL:
                  </h3>
                  <p className="text-white text-sm md:text-base">Apple Pay, Google Pay, Credit Cards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
