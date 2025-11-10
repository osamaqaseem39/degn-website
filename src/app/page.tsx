"use client";

import Hero from "@/components/Hero";
import PaymentIntegration from "@/components/PaymentIntegration";
import OneTapTrading from "@/components/OneTapTrading";
import AIPoweredInsights from "@/components/AIPoweredInsights";
import FAQSection from "@/components/FAQSection";
import WaitlistSection from "@/components/WaitlistSection";

export default function Home() {
  return (
    <main className="min-h-dvh w-full">
      <Hero />
      <PaymentIntegration />
      <OneTapTrading />
      <AIPoweredInsights />
      <FAQSection />
      <WaitlistSection />
    </main>
  );
}
