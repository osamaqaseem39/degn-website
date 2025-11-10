"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-[10000]">
      <div className="mx-auto max-w-[1600px] px-6">
		<nav className="mt-4 flex items-center justify-between rounded-full px-4 py-2 backdrop-blur">
			{/* Logo */}
			<Link href="/" className="flex items-center gap-2">
				<img src="/images/logo.png" alt="Degn logo" width={160} height={140} />
			
			</Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8 text-[18px] text-white">
            <Link href="#app" className="hover:text-white transition-colors">Degn App</Link>
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#why" className="hover:text-white transition-colors">Why Degn?</Link>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
			<button
              type="button"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-white hover:text-white hover:bg-white/10 transition-colors"
            >
				  <img src="/images/en.png" alt="UK flag" width={32} height={32} loading="lazy" />
              <span>EN</span>
            </button>
            <Link
              href="#waitlist"
				className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-1 text-base md:text-lg font-medium text-white shadow-[0_0_28px_rgba(236,72,153,0.6)] hover:opacity-95 transition-opacity"
            >
              Join Waitlist
            </Link>
          </div>
        </nav>
      </div>
      {/* spacer to offset fixed header height */}
      <div className="h-16" />
    </header>
  );
}


