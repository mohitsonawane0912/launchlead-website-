import React from 'react';
import { siteConfig } from '../config/siteConfig';

export const AboutPage: React.FC = () => {
  const { eyebrow, heading, subtitle, introTitle, introDescription, pillars, teamPlaceholder } = siteConfig.about;

  return (
    <div className="flex flex-col">
      {/* Dark Navy Hero */}
      <section className="relative overflow-hidden hero-radial-bg py-16 sm:py-24 border-b border-slate-800/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block mb-3">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-blue-400 bg-blue-950/60 border border-blue-800/50 rounded-full px-3.5 py-1"
              style={{ letterSpacing: '0.22em' }}
            >
              {eyebrow}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
            {heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Content on Light Lavender-Gray Background */}
      <section className="bg-[#f3f5fa] py-16 sm:py-24 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Intro Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100 max-w-4xl mx-auto text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1128] mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
              {introTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {introDescription}
            </p>
          </div>

          {/* Three Cards: Mission, Vision, Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 sm:p-8 flex flex-col items-start shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100 hover:shadow-[0_16px_32px_rgba(15,23,42,0.1)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                  {idx === 0 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#0a1128] mb-3 font-['Plus_Jakarta_Sans',sans-serif]">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Our Team Section with Honest Placeholder */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#0a1128] mb-3 font-['Plus_Jakarta_Sans',sans-serif]">
              Our Team
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              {teamPlaceholder}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
