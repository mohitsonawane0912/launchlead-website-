import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { HeroArtwork } from './HeroArtwork';

export const Hero: React.FC = () => {
  const { eyebrow, brandName, headline, supportingText } = siteConfig.hero;
  const { registerAction, exploreProgramsAction } = siteConfig.navigation;

  return (
    <section className="relative overflow-hidden hero-radial-bg pt-12 pb-20 md:pt-20 md:pb-32 border-b border-slate-800/60">
      {/* Decorative ambient gradient backdrop on right side */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* 1. Eyebrow */}
            <div className="inline-block mb-3">
              <span
                className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-blue-400 bg-blue-950/60 border border-blue-800/50 rounded-full px-3.5 py-1"
                style={{ letterSpacing: '0.22em' }}
              >
                {eyebrow}
              </span>
            </div>

            {/* 2. Large blue-gradient brand heading: Aedvix */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-2">
              <span className="text-gradient-blue font-['Plus_Jakarta_Sans',sans-serif]">
                {brandName}
              </span>
            </h1>

            {/* 3. White bold headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-6">
              {headline}
            </h2>

            {/* 4. Supporting text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {supportingText}
            </p>

            {/* 5 & 6. Primary and Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
              {/* Primary filled blue button: Register Now with right arrow */}
              <Link
                to={registerAction.path}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] group"
              >
                <span>{registerAction.label}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* Secondary outlined button: Explore Programs */}
              <Link
                to={exploreProgramsAction.path}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-slate-600 hover:border-slate-400 bg-slate-900/40 hover:bg-slate-800/60 text-slate-200 hover:text-white font-semibold text-base transition-all duration-200 active:scale-[0.98]"
              >
                {exploreProgramsAction.label}
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Abstract Artwork */}
          <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <HeroArtwork className="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
