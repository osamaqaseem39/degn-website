"use client";

import { useEffect, useState } from "react";
import Header from "./Header";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleReady = () => {
      window.setTimeout(() => {
        setIsReady(true);
      }, 400);
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady);
    }

    return () => {
      window.removeEventListener("load", handleReady);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[20000] flex items-center justify-center bg-black transition-opacity duration-500 ease-out ${
          isReady ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <img src="/images/logo.png" alt="Degn logo" className="w-32 h-auto animate-pulse" />
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full w-full origin-left"
              style={{
                animation: "loaderBar 1.4s ease-in-out infinite",
                background: "linear-gradient(90deg, rgba(236,72,153,0.4) 0%, rgba(59,130,246,0.8) 100%)",
              }}
            />
          </div>
        </div>
      </div>

      <Header />
      <div
        className={`relative mx-auto max-w-[1600px] px-6 transition-all duration-700 ease-out ${
          isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>

      <div className="pointer-events-none fixed -bottom-40 left-10 z-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
    </>
  );
}

