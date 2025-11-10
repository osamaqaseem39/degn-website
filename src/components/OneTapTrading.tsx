"use client";

import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function OneTapTrading() {
  const { ref: headerRef, isVisible: headerVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useInViewAnimation<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden py-32 md:py-48 bg-black">
      <div className="mx-auto max-w-[1400px] px-6 w-full">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-white mb-4">
            <span className="block text-[14px] md:text-[24px] leading-[1.4] tracking-[0.02em] font-light" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              One-Tap Trading
            </span>
          </h2>
          <p className="text-white text-[22px] md:text-[48px] font-bold uppercase tracking-wider" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
            NO HASSLE
          </p>
        </div>

        {/* Spacer previously used by 3D model - reduced spacing now */}
        <div className="mb-8" />

        {/* Feature blocks */}
        <div ref={gridRef} className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ease-out ${gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Feature 1: 500+ Payment Methods */}
          <div className="relative">
            {/* Circular transparent gray icon */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
              <img
                src="/images/download.png"
                alt="Download icon"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl p-8 pt-16 h-[200px] flex flex-col justify-center shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
              <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                500+
              </h3>
              <p className="text-white text-sm md:text-base">One-Tap Buying With Apple Pay, Google Pay, SEPA, And More</p>
            </div>
          </div>

          {/* Feature 2: 30S Instant Onboarding */}
          <div className="relative">
            {/* Circular transparent gray icon */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
              <img
                src="/images/bestreview.png"
                alt="Thumbs up icon"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl p-8 pt-16 h-[200px] flex flex-col justify-center shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
              <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                30S
              </h3>
              <p className="text-white text-sm md:text-base">Instant Onboarding With Pre-Built Wallets & No Setup Required</p>
            </div>
          </div>

          {/* Feature 3: 10K Coins */}
          <div className="relative">
            {/* Circular transparent gray icon */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
              <img
                src="/images/stock.png"
                alt="Trading icon"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl p-8 pt-16 h-[200px] flex flex-col justify-center shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
              <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                10K COINS
              </h3>
              <p className="text-white text-sm md:text-base">Real-Time Social Sentiment & Trend Analysis For Smarter Trading</p>
            </div>
          </div>

          {/* Feature 4: 130+ Countries */}
          <div className="relative">
            {/* Circular transparent gray icon */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-500/30 backdrop-blur-sm flex items-center justify-center border border-gray-400/50">
              <img
                src="/images/glob.png"
                alt="Globe icon"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl p-8 pt-16 h-[200px] flex flex-col justify-center shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
              <h3 className="text-[18px] md:text-[24px] font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                130+
              </h3>
              <p className="text-white text-sm md:text-base">Available In 130+ Countries Around The World</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
