"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  content: string;
  fullContent: string;
}

const blogPosts: Record<string, BlogPost> = {
  "1": {
    id: "1",
    title: "The Future of Meme Coin Trading: AI-Powered Insights",
    excerpt: "Discover how artificial intelligence is revolutionizing meme coin trading, providing traders with real-time sentiment analysis and predictive market trends that help identify the next viral cryptocurrency.",
    author: "Degn Team",
    date: "March 15, 2024",
    image: "/images/brain.png",
    category: "Trading Insights",
    content: "Artificial intelligence is transforming the world of cryptocurrency trading, and meme coins are no exception.",
    fullContent: `
      <p>Artificial intelligence is transforming the world of cryptocurrency trading, and meme coins are no exception. In this comprehensive guide, we explore how AI-powered insights are revolutionizing the way traders approach meme coin markets.</p>
      
      <h2>The Power of AI in Meme Coin Trading</h2>
      <p>Meme coins have become a significant part of the cryptocurrency ecosystem, but their volatile nature makes them challenging to trade. This is where AI comes in. By analyzing vast amounts of social media data, market trends, and trading patterns, AI can help identify promising meme coins before they go viral.</p>
      
      <h2>Real-Time Sentiment Analysis</h2>
      <p>One of the most powerful features of AI in meme coin trading is real-time sentiment analysis. Our platform monitors thousands of social media posts, tweets, and discussions to gauge community sentiment around different meme coins. This allows traders to:</p>
      <ul>
        <li>Identify trending coins before they hit the mainstream</li>
        <li>Understand community sentiment and predict price movements</li>
        <li>Avoid coins with negative sentiment or potential scams</li>
        <li>Make data-driven decisions instead of relying on hype</li>
      </ul>
      
      <h2>Predictive Market Trends</h2>
      <p>AI algorithms can analyze historical data and current market conditions to predict potential trends. By looking at patterns from successful meme coins, our AI can identify similar characteristics in emerging coins, giving traders an edge in the market.</p>
      
      <h2>Risk Assessment</h2>
      <p>Trading meme coins comes with inherent risks. AI helps mitigate these risks by providing comprehensive risk assessments based on multiple factors, including liquidity, market cap, development activity, and community engagement. This helps traders make informed decisions and avoid potential pitfalls.</p>
      
      <h2>Conclusion</h2>
      <p>The future of meme coin trading is here, and it's powered by AI. By leveraging artificial intelligence, traders can make more informed decisions, identify opportunities early, and navigate the volatile meme coin market with greater confidence. As the technology continues to evolve, we can expect even more sophisticated tools and insights that will further revolutionize the trading experience.</p>
    `
  },
  "2": {
    id: "2",
    title: "One-Tap Trading: Simplifying Cryptocurrency Transactions",
    excerpt: "Learn how one-tap trading technology is making cryptocurrency transactions faster and more accessible than ever before, eliminating the need for complex wallet setups and multiple confirmation steps.",
    author: "Degn Team",
    date: "March 10, 2024",
    image: "/images/download.png",
    category: "Technology",
    content: "One-tap trading is revolutionizing how users interact with cryptocurrency markets.",
    fullContent: `
      <p>One-tap trading is revolutionizing how users interact with cryptocurrency markets. Gone are the days of complex wallet setups, multiple confirmations, and confusing interfaces. Today's traders demand simplicity and speed, and that's exactly what one-tap trading delivers.</p>
      
      <h2>What is One-Tap Trading?</h2>
      <p>One-tap trading allows users to execute cryptocurrency trades with a single tap or click. This technology streamlines the entire trading process, from wallet connection to trade execution, making it accessible to both beginners and experienced traders.</p>
      
      <h2>The Benefits of Simplified Trading</h2>
      <p>Traditional cryptocurrency trading requires multiple steps: connecting a wallet, approving transactions, signing messages, and confirming trades. One-tap trading eliminates all of this complexity:</p>
      <ul>
        <li><strong>Speed:</strong> Execute trades instantly without waiting for multiple confirmations</li>
        <li><strong>Simplicity:</strong> No need to understand complex wallet configurations</li>
        <li><strong>Security:</strong> Advanced security measures ensure safe transactions</li>
        <li><strong>Accessibility:</strong> Makes trading accessible to users of all experience levels</li>
      </ul>
      
      <h2>Pre-Built Wallets and Instant Onboarding</h2>
      <p>One of the key features of one-tap trading is the integration of pre-built wallets. Users no longer need to set up and configure their own wallets. Instead, they can start trading immediately with a pre-configured wallet that's secure and easy to use.</p>
      
      <h2>500+ Payment Methods</h2>
      <p>Our platform supports over 500 payment methods, including Apple Pay, Google Pay, SEPA, and traditional credit cards. This means users can fund their accounts and start trading using the payment method they're most comfortable with.</p>
      
      <h2>30-Second Onboarding</h2>
      <p>Traditional trading platforms require lengthy registration processes and verification steps. With one-tap trading, users can complete onboarding in just 30 seconds, getting them into the market faster than ever before.</p>
      
      <h2>The Future of Trading</h2>
      <p>As cryptocurrency trading becomes more mainstream, the demand for simplified, user-friendly platforms will only grow. One-tap trading represents the future of cryptocurrency transactions, making trading accessible to everyone while maintaining the security and functionality that experienced traders demand.</p>
      
      <h2>Conclusion</h2>
      <p>One-tap trading is more than just a convenience feature—it's a fundamental shift in how we think about cryptocurrency trading. By eliminating barriers and simplifying the trading process, we're opening up the cryptocurrency market to a whole new generation of traders.</p>
    `
  },
  "3": {
    id: "3",
    title: "Social Sentiment Analysis: The Key to Meme Coin Success",
    excerpt: "Explore how social media sentiment analysis can help traders identify promising meme coins early, leveraging community buzz and trending discussions to make informed trading decisions.",
    author: "Degn Team",
    date: "March 5, 2024",
    image: "/images/people.png",
    category: "Market Analysis",
    content: "Social media has become the driving force behind meme coin popularity.",
    fullContent: `
      <p>Social media has become the driving force behind meme coin popularity. Understanding community sentiment and social trends is crucial for successful meme coin trading. In this article, we explore how social sentiment analysis can help traders identify promising opportunities.</p>
      
      <h2>Understanding Social Sentiment</h2>
      <p>Social sentiment analysis involves monitoring and analyzing social media platforms, forums, and online communities to gauge public opinion about specific meme coins. This includes tracking mentions, engagement rates, sentiment scores, and trending discussions.</p>
      
      <h2>Why Social Sentiment Matters</h2>
      <p>Meme coins are unique in that their value is often driven by community engagement and social media buzz rather than traditional fundamentals. A coin that's trending on Twitter or Reddit can see massive price movements in a matter of hours. By tracking social sentiment, traders can:</p>
      <ul>
        <li>Identify coins before they go viral</li>
        <li>Gauge community enthusiasm and engagement</li>
        <li>Detect potential pump-and-dump schemes</li>
        <li>Understand market psychology and trends</li>
      </ul>
      
      <h2>Real-Time Monitoring</h2>
      <p>Our platform monitors multiple social media platforms in real-time, including Twitter, Reddit, Discord, and Telegram. We track mentions, hashtags, engagement metrics, and sentiment scores to provide traders with up-to-date information about what the community is talking about.</p>
      
      <h2>Sentiment Scoring</h2>
      <p>Each meme coin receives a sentiment score based on multiple factors:</p>
      <ul>
        <li><strong>Positive Mentions:</strong> The number of positive mentions and comments</li>
        <li><strong>Engagement Rate:</strong> How actively the community is discussing the coin</li>
        <li><strong>Influencer Activity:</strong> Whether prominent influencers are mentioning it</li>
        <li><strong>Community Growth:</strong> The rate at which the community is growing</li>
        <li><strong>Trending Status:</strong> Whether the coin is trending on major platforms</li>
      </ul>
      
      <h2>Early Detection of Trends</h2>
      <p>One of the key advantages of social sentiment analysis is early trend detection. By monitoring social media, traders can identify coins that are gaining traction before they hit the mainstream. This early detection can be the difference between catching a trend early or missing it entirely.</p>
      
      <h2>Community Insights Dashboard</h2>
      <p>Our community insights dashboard provides traders with a comprehensive view of what's happening in the meme coin community. This includes trending coins, popular discussions, influencer activity, and community sentiment scores. This information helps traders make informed decisions based on real-time community data.</p>
      
      <h2>Case Studies</h2>
      <p>Numerous meme coins have seen explosive growth driven by social media buzz. Coins that start trending on Twitter or Reddit can see their prices increase by hundreds or even thousands of percent in a matter of days. By tracking social sentiment, traders can position themselves to take advantage of these trends.</p>
      
      <h2>Best Practices</h2>
      <p>While social sentiment analysis is a powerful tool, it's important to use it as part of a comprehensive trading strategy:</p>
      <ul>
        <li>Don't rely solely on social sentiment—consider other factors as well</li>
        <li>Be cautious of coordinated pump schemes</li>
        <li>Verify information from multiple sources</li>
        <li>Set stop-losses to protect against sudden reversals</li>
        <li>Stay informed about market conditions and news</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Social sentiment analysis is becoming an essential tool for meme coin traders. By understanding community sentiment and social trends, traders can identify opportunities early and make more informed trading decisions. As social media continues to play a crucial role in meme coin markets, the importance of sentiment analysis will only continue to grow.</p>
    `
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const postId = params?.id as string;
  const post = postId ? blogPosts[postId] : null;

  const { ref: headerRef, isVisible: headerVisible } = useInViewAnimation<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useInViewAnimation<HTMLDivElement>();

  if (!post) {
    return (
      <main className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold mb-4" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
              Blog Post Not Found
            </h1>
            <Link 
              href="/" 
              className="text-pink-500 hover:text-pink-400 transition-colors"
              style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 md:py-32 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/#blog" 
            className="inline-flex items-center text-pink-500 hover:text-pink-400 transition-colors text-sm md:text-base"
            style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div ref={headerRef} className={`mb-8 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium border border-gray-400/50" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm md:text-base" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-[0_0_30px_rgba(138,11,74,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 flex items-center justify-center">
            <img
              src={post.image}
              alt={post.title}
              className="w-32 h-32 md:w-48 md:h-48 object-contain opacity-80"
              loading="eager"
            />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={contentRef} 
          className={`prose prose-invert max-w-none transition-all duration-700 ease-out ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div 
            className="text-white/90 leading-relaxed space-y-6"
            style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />
        </div>

        {/* Back to Blog Link */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link 
            href="/#blog" 
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]"
            style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </main>
  );
}

