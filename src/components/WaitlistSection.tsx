"use client";

import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function WaitlistSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeToEmails: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const { ref: cardRef, isVisible: cardVisible } = useInViewAnimation<HTMLDivElement>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Successfully added to waitlist!'
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          agreeToEmails: false
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to submit. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="relative overflow-hidden py-20 md:py-32 bg-black">
      <div className=" max-w-[1600px] px-6 w-full">
        <div ref={cardRef} className={`max-w-xl mx-auto transition-all duration-700 ease-out ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Waitlist Form Container */}
            <div className="relative rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(138,11,74,0.4)] hover:shadow-[0_0_40px_rgba(138,11,74,0.6)] transition-all duration-300" style={{ background: 'radial-gradient(circle,rgba(138, 11, 74, 0.15) 0%,rgba(0, 17, 255, 0.23) 100%)' }}>
            {/* Background gradient effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-white mb-6">
                  <span className="block text-[18px] md:text-[32px] leading-[1.2] tracking-[0.01em] uppercase" style={{ fontFamily: '\"Press Start\", Arial, Helvetica, sans-serif' }}>
                    ENTER THE WAITLIST
                  </span>
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
                    style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
                    style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
                  />
                </div>

                {/* Discord Button */}
                <div>
                  <a
                    href="https://discord.gg/FtHhMzqF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-pink-500 text-white font-medium hover:bg-pink-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] inline-flex items-center justify-center"
                    style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
                  >
                    JOIN OUR DISCORD SERVER
                  </a>
                </div>

                {/* Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToEmails"
                    checked={formData.agreeToEmails}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-black/40 text-pink-500 focus:ring-pink-500/20 focus:ring-2"
                  />
                  <label className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                    I agree to receive promotional emails and updates
                  </label>
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-xl ${
                      submitStatus.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : 'bg-red-500/20 border border-red-500/50 text-red-400'
                    }`}
                  >
                    <p className="text-sm" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
