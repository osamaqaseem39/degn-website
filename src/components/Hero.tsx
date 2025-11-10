"use client";

import Link from "next/link";
import ThreeScene from "./ThreeScene";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

const PRIMARY_MODEL_PATH = "/images/Phone_02-Spotlight.glb";
const SECONDARY_MODEL_PATH = "/images/Phone_3.glb";

export default function Hero() {
  const { scrollProgress, elementRef } = useScrollProgress();
  const modelColumnRef = useRef<HTMLDivElement>(null);
  const [firstContainerRect, setFirstContainerRect] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [secondContainerRect, setSecondContainerRect] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const rafRef = useRef<number | null>(null);
  const rafRef2 = useRef<number | null>(null);
  const [modelsReadyMap, setModelsReadyMap] = useState<Record<string, boolean>>({});
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  const handleModelReady = useCallback((modelPath: string) => {
    setModelsReadyMap(prev => {
      if (prev[modelPath]) return prev;
      return { ...prev, [modelPath]: true };
    });
  }, []);

  // Calculate responsive offsets based on screen width - memoized for performance
  const { offsetX: offsetXpx, offsetY: offsetYpx } = useMemo(() => {
    if (windowWidth === 0) return { offsetX: 0, offsetY: 0 }; // Default before first render
    
    // Every 100px breakpoint from 2000 to 700, offset changes by 100
    if (windowWidth >= 2000) return { offsetX: 750, offsetY: -950 };
    else if (windowWidth >= 1900) return { offsetX: 750, offsetY: -900 };
    else if (windowWidth >= 1800) return { offsetX: 750, offsetY: -900 };
    else if (windowWidth >= 1700) return { offsetX: 700, offsetY: -900 };
    else if (windowWidth >= 1600) return { offsetX: 670, offsetY: -900 };
    else if (windowWidth >= 1500) return { offsetX: 650, offsetY: -900 };
    else if (windowWidth >= 1400) return { offsetX: 550, offsetY: -900 };
    else if (windowWidth >= 1300) return { offsetX: 550, offsetY: -900 };
    else if (windowWidth >= 1200) return { offsetX: 500, offsetY: -900 };
    else if (windowWidth >= 1100) return { offsetX: 450, offsetY: -900 };
    else if (windowWidth >= 1000) return { offsetX: 450, offsetY: -900 };
    else if (windowWidth >= 900) return { offsetX: -400, offsetY: -600 };
    else if (windowWidth >= 800) return { offsetX: -350, offsetY: -600 };
    else if (windowWidth >= 700) return { offsetX: -350, offsetY: -500 };
    // Below 700px
    else return { offsetX: -250, offsetY: -400 };
  }, [windowWidth]);

  // Detect mobile (typically < 768px for md breakpoint)
  const isMobile = windowWidth > 0 && windowWidth < 768;

  const trackedModelPaths = useMemo(() => {
		return isMobile ? [PRIMARY_MODEL_PATH] : [PRIMARY_MODEL_PATH, SECONDARY_MODEL_PATH];
  }, [isMobile]);

  const allTrackedModelsReady = useMemo(() => {
    return trackedModelPaths.every(path => modelsReadyMap[path]);
  }, [modelsReadyMap, trackedModelPaths]);

  useEffect(() => {
		if (!allTrackedModelsReady) {
			setIsPreloaderVisible(true);
			return;
		}

		const timeout = window.setTimeout(() => setIsPreloaderVisible(false), 250);
		return () => window.clearTimeout(timeout);
  }, [allTrackedModelsReady]);

  // Memoize transform calculations to reduce re-renders
  const firstModelTransform = useMemo(() => {
    // On mobile, no transform - just stay in place
    if (isMobile) {
      return `translate(-40px, -60px)`;
    }
    if (scrollProgress >= 0.99) {
      return `translate(${-(0.99 * 80)}vw, ${0.99 * 200}vh) translate(-40px, -60px)`;
    }
    return `translate(${-(scrollProgress * 80)}vw, ${scrollProgress * 200}vh) translate(-40px, -60px)`;
  }, [scrollProgress, isMobile]);

  // Memoize opacity calculations for seamless model transition
  const firstModelOpacity = useMemo(() => {
    if (isMobile) return 1;

    const transitionStart = 0.55;
    const transitionEnd = 0.65;

    if (scrollProgress <= transitionStart) return 1;
    if (scrollProgress >= transitionEnd) return 0;

    const t = (scrollProgress - transitionStart) / (transitionEnd - transitionStart);
    return 1 - t;
  }, [isMobile, scrollProgress]);

  const secondModelOpacity = useMemo(() => {
    if (isMobile) return 0;

    const transitionStart = 0.55;
    const transitionEnd = 0.65;

    if (scrollProgress <= transitionStart) return 0;
    if (scrollProgress >= transitionEnd) return 1;

    const t = (scrollProgress - transitionStart) / (transitionEnd - transitionStart);
    return t;
  }, [isMobile, scrollProgress]);

  // Optimized container rect update for first model using requestAnimationFrame with throttling
  useEffect(() => {
    let ticking = false;
    let lastUpdateTime = 0;
    const throttleMs = 16; // ~60fps
    
    const updateContainerRect = () => {
      const el = modelColumnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only update if values actually changed to prevent unnecessary re-renders
      setFirstContainerRect(prev => {
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
        rafRef.current = requestAnimationFrame(updateContainerRect);
      }
    };

    // Initial update
    updateContainerRect();
    
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateContainerRect);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateContainerRect);
    };
  }, []);

  // Optimized container rect update for second model using requestAnimationFrame with throttling
  useEffect(() => {
    let ticking = false;
    let lastUpdateTime = 0;
    const throttleMs = 16; // ~60fps
    
    const updateContainerRect = () => {
      const el = modelColumnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only update if values actually changed to prevent unnecessary re-renders
      setSecondContainerRect(prev => {
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
        rafRef2.current = requestAnimationFrame(updateContainerRect);
      }
    };

    // Initial update
    updateContainerRect();
    
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateContainerRect);
    
    return () => {
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateContainerRect);
    };
  }, []);

  // Track window width for responsive offsets - throttled for performance
  useEffect(() => {
    let ticking = false;
    let lastWidth = window.innerWidth;
    
    const updateWidth = () => {
      const newWidth = window.innerWidth;
      // Only update if width changed significantly (more than 50px) to reduce re-renders
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

    setWindowWidth(window.innerWidth); // Set initial width
    window.addEventListener("resize", throttledUpdateWidth, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledUpdateWidth);
    };
  }, []);


  return (
		<section ref={elementRef} className="relative overflow-hidden min-h-[100dvh] flex items-center w-full pt-16 md:pt-0">
			{isPreloaderVisible && (
				<div className="fixed inset-0 z-[20000] flex flex-col items-center justify-center gap-6 bg-[#050414] text-white transition-opacity duration-500">
					<div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" aria-hidden="true" />
					<p className="text-sm uppercase tracking-[0.4em]" style={{ fontFamily: '"Press Start", Arial, Helvetica, sans-serif' }}>Loading</p>
				</div>
			)}
			<div className="mx-auto max-w-[1400px] px-6 w-full">
				<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
					{/* Text column (50%) */}
					<div className="md:col-span-6 text-center pt-24 md:pt-0">
						<h1 className="text-white">
							<span className="block text-[20px] md:text-[32px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
								TRADE MEMECOINS
							</span>
							<span className="block text-[20px] md:text-[32px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
								IN ONE TAP WITH DEGN
							</span>
						</h1>

						<p
							className="mt-4 text-white mx-auto max-w-2xl"
							style={{
								fontFamily: 'var(--font-inter-thin), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
								fontWeight: 100,
								fontSize: 20,
								lineHeight: "24px",
								letterSpacing: "0.02em",
								textAlign: "center",
							}}
						>
							No complex setups, no hidden fees just seamless, intuitive trading
						</p>

						<div className="mt-6 flex flex-wrap items-center justify-center gap-4">
							<Link href="#appstore" className="inline-flex">
								<img src="/images/appstore.png" alt="Download on the App Store" width={175} height={72} />
							</Link>
							<Link href="#googleplay" className="inline-flex">
								<img src="/images/playstore.webp" alt="Download on the Google Play" width={175} height={72} />
							</Link>
					
						</div>

						<div className="mt-4">
							<Link href="#waitlist" className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-1 text-sm md:text-base font-medium text-white shadow-[0_0_28px_rgba(236,72,153,0.6)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] hover:opacity-95 transition-all duration-300">
								Join Waitlist
							</Link>
						</div>

						<p className="mt-3 text-sm text-white" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 100, fontSize: 16, lineHeight: "20px", letterSpacing: "0.02em", textAlign: "center" }}>500+ User Signed Up For The Waitlist</p>
					</div>

					{/* Visual column (50%) */}
					<div ref={modelColumnRef} className="md:col-span-6 w-full h-[400px] md:h-[600px] relative pt-24 md:pt-0">
						{/* Glow effect behind 3D model */}
						<div className="absolute inset-0 flex items-center justify-center z-0">
							<div className="h-[500px] w-[500px] md:h-[500px] md:w-[500px] rounded-full bg-[#0013FF]/35 blur-3xl animate-pulse" />
							<div className="absolute h-[300px] w-[300px] md:h-[300px] md:w-[300px] rounded-full bg-pink-500/20 blur-2xl animate-pulse delay-1000" />
						</div>
						{/* First model container */}
						{firstContainerRect.width > 0 && firstContainerRect.height > 0 && (
							<div
								className={isMobile ? "absolute inset-0 z-[1099] pointer-events-none" : "fixed z-[1099] pointer-events-none"}
								style={isMobile ? {} : {
									top: firstContainerRect.top + offsetYpx + 30,
									left: firstContainerRect.left + offsetXpx + 100,
									width: firstContainerRect.width,
									height: firstContainerRect.height,
								}}
							>
								{/* First model (Phone_02-Spotlight.glb) - fades out between 55% and 65% scroll */}
								<div
									className="absolute inset-0 flex items-center justify-center"
									style={{
										transform: firstModelTransform,
										willChange: isMobile ? 'auto' : (scrollProgress >= 0.99 ? 'auto' : 'transform'),
										opacity: firstModelOpacity,
										visibility: firstModelOpacity <= 0.01 ? 'hidden' : 'visible',
										pointerEvents: firstModelOpacity > 0 ? 'auto' : 'none',
									}}
								>
									<ThreeScene
										modelPath={PRIMARY_MODEL_PATH}
										noLights={false}
										scrollProgress={isMobile ? undefined : scrollProgress}
										enableScrollAnimation={!isMobile}
										autoRotate={isMobile}
										rotationSpeed={isMobile ? 0.2 : undefined}
										semiRotate={isMobile}
										scaleMultiplier={1.5}
										initialRotation={[0, -0.3, -0.45]} // Rotated left to cross with the bottom model
										className="w-full h-full"
										opacity={firstModelOpacity}
										onModelReady={handleModelReady}
									/>
								</div>
								{/* Second model (Phone_3.glb) - fades in between 55% and 65% scroll */}
								{!isMobile && (
									<div
										className="absolute inset-0 flex items-center justify-center"
										style={{
											transform: firstModelTransform,
											willChange: scrollProgress >= 0.99 ? 'auto' : 'transform',
											opacity: secondModelOpacity,
											visibility: secondModelOpacity <= 0.01 ? 'hidden' : 'visible',
											pointerEvents: secondModelOpacity > 0 ? 'auto' : 'none',
										}}
									>
										<ThreeScene
											modelPath={SECONDARY_MODEL_PATH}
											noLights={false}
											scrollProgress={scrollProgress}
											enableScrollAnimation
											autoRotate={false}
											scaleMultiplier={1.5}
											initialRotation={[0, -0.3, -0.45]} // Rotated left to cross with the bottom model
											className="w-full h-full"
											opacity={secondModelOpacity}
											onModelReady={handleModelReady}
										/>
									</div>
								)}
							</div>
						)}
						{/* Second model container - hidden on mobile */}
						{!isMobile && secondContainerRect.width > 0 && secondContainerRect.height > 0 && (
							<div
								className="absolute inset-0 z-[999] pointer-events-none"
								style={{
									top: -50,
									left: -100,
									width: secondContainerRect.width,
									height: secondContainerRect.height,
								}}
							>
								{/* Second model (Unity_Phone_01.glb) - static model */}
								<div
									className="absolute inset-0 flex items-center justify-center"
									style={{
										transform: `translate(0, 0)`,
										willChange: 'auto',
									}}
								>
									<ThreeScene
										modelPath="/images/Unity_Phone_01.glb"
										noLights={false}
										scrollProgress={undefined}
										enableScrollAnimation={false}
										autoRotate={false}
										scaleMultiplier={1.4}
										initialRotation={[0, -0.3, -0.5]} // Rotated left to cross with the bottom model
										className="w-full h-full"
										onModelReady={handleModelReady}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}