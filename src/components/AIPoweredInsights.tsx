"use client";

import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function AIPoweredInsights() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { ref: textRef, isVisible: textVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: visualRef, isVisible: visualVisible } = useInViewAnimation<HTMLDivElement>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12">
          {/* Text column (70%) */}
          <div ref={textRef} className={`md:col-span-8 text-center md:text-left transition-all duration-700 ease-out ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="block text-[14px] md:text-[24px] leading-[1.4] tracking-[0.02em] font-light mb-4" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Why You Choose Our App
            </span>
            
            <h2 className="text-white mb-6 text-center md:text-left">
              <span className="block text-[20px] md:text-[36px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                DISCOVER THE NEXT BIG
              </span>
              <span className="block text-[20px] md:text-[36px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                MEME WITH AI-POWERED
              </span>
              <span className="block text-[20px] md:text-[36px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                INSIGHTS
              </span>
            </h2>

            <p className="text-white/80 text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400 }}>
              Stay ahead of the meme market with our Smart Meme Discovery feature. Powered by AI, we track social sentiment, trends, and risk factors giving you the edge in the fast-moving world of meme coins.
            </p>

            {/* Feature boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {/* AI Spotlight Algorithm */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/brain.png"
                    alt="Brain icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[16px] font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    AI SPOTLIGHT 
                  </h3>
                  <p className="text-white text-sm">Tracks Social Sentiment & Trading Volume</p>
                </div>
              </div>

              {/* Real-Time Trending */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/graph.png"
                    alt="Graph icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[16px] font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    REAL-TIME TRENDING
                  </h3>
                  <p className="text-white text-sm">Meme Alerts To Catch The Next Viral Coin Early</p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/bestreview.png"
                    alt="Checkmark icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[16px] font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    RISK ASSESSMENT
                  </h3>
                  <p className="text-white text-sm">Scoring For Better Decision-Making</p>
                </div>
              </div>

              {/* Community Insights */}
              <div className="relative">
                {/* Circular transparent gray icon */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
                  <img
                    src="/images/people.png"
                    alt="People icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-xl p-6 pt-12 shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                  <h3 className="text-[16px] font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    COMMUNITY INSIGHTS
                  </h3>
                  <p className="text-white text-sm">Dashboard To See What Traders Are Buzzing About</p>
                </div>
              </div>
            </div>

            {/* Coming Soon Button */}
            <div className="mt-12 text-center">
              <button className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-1 text-sm md:text-base font-medium text-white shadow-[0_0_28px_rgba(236,72,153,0.6)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] hover:opacity-95 transition-all duration-300">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Visual column (30%) - moved to right */}
          <div 
            ref={visualRef}
            className={`md:col-span-4 w-full h-[450px] md:h-[550px] relative cursor-none transition-all duration-700 ease-out ${visualVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glow effect behind bull image */}
            <div className="absolute inset-0 flex items-center justify-center translate-x-8">
              <div className="h-[400px] w-[300px] md:h-[500px] md:w-[350px] rounded-full bg-[#0013FF]/35 blur-3xl animate-pulse" />
              <div className="absolute h-[250px] w-[200px] md:h-[300px] md:w-[250px] rounded-full bg-pink-500/20 blur-2xl animate-pulse delay-1000" />
            </div>
            <img
              src="/images/bull.png"
              alt="AI-powered bull mascot"
              className="absolute inset-0 w-full h-full object-contain relative z-10 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`
              }}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
