"use client";

import Link from "next/link";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Meme Coin Trading: AI-Powered Insights",
    excerpt: "Discover how artificial intelligence is revolutionizing meme coin trading, providing traders with real-time sentiment analysis and predictive market trends that help identify the next viral cryptocurrency.",
    author: "Degn Team",
    date: "March 15, 2024",
    image: "/images/brain.png",
    category: "Trading Insights"
  },
  {
    id: "2",
    title: "One-Tap Trading: Simplifying Cryptocurrency Transactions",
    excerpt: "Learn how one-tap trading technology is making cryptocurrency transactions faster and more accessible than ever before, eliminating the need for complex wallet setups and multiple confirmation steps.",
    author: "Degn Team",
    date: "March 10, 2024",
    image: "/images/download.png",
    category: "Technology"
  },
  {
    id: "3",
    title: "Social Sentiment Analysis: The Key to Meme Coin Success",
    excerpt: "Explore how social media sentiment analysis can help traders identify promising meme coins early, leveraging community buzz and trending discussions to make informed trading decisions.",
    author: "Degn Team",
    date: "March 5, 2024",
    image: "/images/people.png",
    category: "Market Analysis"
  }
];

export default function BlogSection() {
  const { ref: headerRef, isVisible: headerVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useInViewAnimation<HTMLDivElement>();

  return (
    <section id="blog" className="relative overflow-hidden py-32 md:py-48 bg-black">
      <div className="mx-auto max-w-[1400px] px-6 w-full">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-white mb-4">
            <span className="block text-[14px] md:text-[24px] leading-[1.4] tracking-[0.02em] font-light" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              Latest Insights
            </span>
          </h2>
          <p className="text-white text-[22px] md:text-[48px] font-bold uppercase tracking-wider" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
            OUR BLOG
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div ref={cardsRef} className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ease-out ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}`}
              className="group"
            >
              <article className="relative h-full rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(138,11,74,0.3)] hover:shadow-[0_0_30px_rgba(138,11,74,0.5)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
                {/* Image Container */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 flex items-center justify-center">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-80 group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium border border-gray-400/50" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent group-hover:text-white transition-colors duration-300 line-clamp-2" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-3" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                    {post.excerpt}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-white/60" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>

                  {/* Read More Indicator */}
                  <div className="mt-4 flex items-center text-pink-500 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                    Read More →
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

