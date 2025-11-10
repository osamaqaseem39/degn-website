"use client";

import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Degn?",
    answer: "Degn is a revolutionary decentralized exchange (DEX) platform that makes meme coin trading accessible to everyone. We combine advanced AI-powered insights with seamless payment integration to create the ultimate trading experience for both beginners and experts."
  },
  {
    question: "Why should I use Degn instead of other DEXs?",
    answer: "Degn offers unique advantages including AI-powered meme discovery, one-tap trading functionality, integrated payment systems for real money purchases, and comprehensive risk assessment tools. Our platform is designed specifically for meme coin trading with user-friendly features that other DEXs don't provide."
  },
  {
    question: "Can I use real money to buy meme coins on Degn?",
    answer: "Yes! Degn integrates with traditional payment systems, allowing you to purchase meme coins directly with fiat currency (credit cards, bank transfers, etc.). This eliminates the need for complex crypto conversions and makes meme coin trading accessible to everyone."
  },
  {
    question: "How does Degn make trading easier?",
    answer: "Degn simplifies trading through our one-tap trading feature, AI-powered insights that highlight trending coins, integrated payment systems, and intuitive user interface. We handle the complexity so you can focus on making profitable trades."
  },
  {
    question: "How much does Degn charge?",
    answer: "Degn offers competitive trading fees that are transparent and fair. Our fee structure is designed to be lower than traditional exchanges while providing superior features. Specific fee details are available in our trading interface, and we regularly offer promotions for new users."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: listRef, isVisible: listVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: contactRef, isVisible: contactVisible } = useInViewAnimation<HTMLDivElement>();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="why" className="relative overflow-hidden py-20 md:py-32 bg-black">
      <div className="mx-auto max-w-[1600px] px-6 w-full">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
         <span className="block text-[14px] md:text-[24px] leading-[1.4] tracking-[0.02em] font-light mb-4" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
         Why?
           </span>
          <h2 className="text-white mb-8">
            <span className="block text-[22px] md:text-[48px] leading-[1.1] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
              WHY CHOOSE DEGN?
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* FAQ Section */}
          <div ref={listRef} className={`space-y-4 transition-all duration-700 ease-out ${listVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-gray-800/30 pb-2">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between text-left py-4 group"
                >
                  <span className="text-white text-lg md:text-xl font-medium pr-4 group-hover:text-gray-300 transition-colors" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 ${openIndex === index ? 'rotate-45' : ''}`}>
                      <span className="text-white text-xl font-light">+</span>
                    </div>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pt-2 pb-4">
                    <p className="text-gray-300 text-base leading-relaxed" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div ref={contactRef} className={`relative hidden lg:block transition-all duration-700 ease-out ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="relative rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(138,11,74,0.4)] hover:shadow-[0_0_40px_rgba(138,11,74,0.6)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
              {/* Background gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
              
              <div className="relative z-10">
                <h3 className="text-white mb-6 text-center md:text-left">
                  <span className="block text-[18px] md:text-[32px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    WANT TO GET IN TOUCH?
                  </span>
                </h3>
                
                <p className="text-white/90 text-base leading-relaxed mb-8" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                  Have questions? Whether it&apos;s feedback, partnership inquiries, or just saying hi, reach out to us anytime.
                </p>
                
                <div className="space-y-4">
                  <a 
                    href="mailto:hello@degn.app"
                    className="inline-flex items-center text-white text-lg font-medium hover:text-blue-300 transition-colors group"
                    style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
                  >
                    <span className="mr-3">📧</span>
                    hello@degn.app
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  
                  <div className="pt-4">
                    <button className="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-medium text-white transition-colors shadow-lg">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
