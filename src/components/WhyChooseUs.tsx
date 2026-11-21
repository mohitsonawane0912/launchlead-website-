import React from 'react';
import { siteConfig, FeatureCard } from '../config/siteConfig';

const FeatureIcon: React.FC<{ type: FeatureCard['icon'] }> = ({ type }) => {
  switch (type) {
    case 'lightbulb':
      // Lightbulb icon
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v1m0 0a2 2 0 002 2h-4a2 2 0 002-2m-2-1h4m-7-5.5a6 6 0 1110 0c-.8 1-1.5 2.5-1.5 4H8.5c0-1.5-.7-3-1.5-4z"
          />
        </svg>
      );
    case 'mentorship':
      // People icon
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case 'practical':
      // Code brackets icon
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      );
    case 'community':
      // Connected nodes icon
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9 9 0 100-18 9 9 0 000 18z"
            opacity="0.2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.5 9.5l5 5m0-5l-5 5M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3"
          />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="4.5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
          <circle cx="4.5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19.5" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
  }
};

export const WhyChooseUs: React.FC = () => {
  const { eyebrow, heading, subtitle, cards } = siteConfig.features;

  return (
    <section className="bg-[#f3f5fa] py-20 sm:py-24 lg:py-28 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Eyebrow */}
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-3"
            style={{ letterSpacing: '0.2em' }}
          >
            {eyebrow}
          </p>

          {/* Large dark navy heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0a1128] tracking-tight mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
            {heading}
          </h2>

          {/* Centered subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Four Cards Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 sm:p-8 flex flex-col items-start shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100 hover:shadow-[0_16px_32px_rgba(15,23,42,0.1)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Pale-blue icon tile with blue line icon */}
              <div className="w-13 h-13 p-3 rounded-xl bg-blue-50/90 border border-blue-100/80 flex items-center justify-center mb-6">
                <FeatureIcon type={card.icon} />
              </div>

              {/* Dark title */}
              <h3 className="text-xl font-bold text-[#0a1128] mb-3 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {card.title}
              </h3>

              {/* Muted body copy */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
