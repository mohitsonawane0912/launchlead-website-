import React from 'react';

export const HeroArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full bg-purple-600/20 blur-[70px]" />
        <div className="w-[140px] h-[140px] rounded-full bg-cyan-400/20 blur-[50px]" />
      </div>

      <div className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-square flex items-center justify-center">
        {/* Orbital SVG rings */}
        <svg
          viewBox="0 0 540 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="heroOrbitGrad1" x1="50" y1="270" x2="490" y2="270" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="0.4" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="0.8" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="heroOrbitGrad2" x1="270" y1="60" x2="270" y2="480" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" stopOpacity="0.15" />
              <stop offset="0.5" stopColor="#a855f7" stopOpacity="0.65" />
              <stop offset="1" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>

            <filter id="heroPointGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Tilted outer orbital ellipses */}
          <ellipse
            cx="270"
            cy="270"
            rx="235"
            ry="115"
            transform="rotate(-25 270 270)"
            stroke="url(#heroOrbitGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          <ellipse
            cx="270"
            cy="270"
            rx="225"
            ry="85"
            transform="rotate(32 270 270)"
            stroke="url(#heroOrbitGrad2)"
            strokeWidth="1.25"
          />

          <circle
            cx="270"
            cy="270"
            r="165"
            stroke="rgba(168, 85, 247, 0.22)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Fine orbital nodes */}
          <circle cx="430" cy="180" r="5" fill="#38bdf8" filter="url(#heroPointGlow)" />
          <circle cx="430" cy="180" r="10" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
          <circle cx="85" cy="220" r="4.5" fill="#a855f7" filter="url(#heroPointGlow)" />
          <circle cx="85" cy="220" r="8" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
          <circle cx="395" cy="385" r="4" fill="#38bdf8" filter="url(#heroPointGlow)" />
          <circle cx="270" cy="85" r="5" fill="#ffffff" filter="url(#heroPointGlow)" />
          <circle cx="270" cy="85" r="12" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1" />
        </svg>

        {/* Center Official AEDVIX Emblem Display */}
        <div className="relative z-10 w-[240px] sm:w-[280px] lg:w-[320px] aspect-square flex items-center justify-center p-6 rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 shadow-[0_20px_50px_rgba(109,40,217,0.35)]">
          <img
            src="/aedvix-emblem-dark.png"
            alt="AEDVIX Logo Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(168,85,247,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};
