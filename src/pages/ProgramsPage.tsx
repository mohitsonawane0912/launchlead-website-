import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';

export const ProgramsPage: React.FC = () => {
  const { eyebrow, heading, subtitle, plans } = siteConfig.programs;

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

      {/* Plans Section on Light Lavender-Gray Background */}
      <section className="bg-[#f3f5fa] py-16 sm:py-24 text-slate-900 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(15,23,42,0.06)] border transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-xl'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-8">
                    <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h2 className="text-2xl font-bold text-[#0a1128] mb-2 font-['Plus_Jakarta_Sans',sans-serif]">
                    {plan.name}
                  </h2>

                  {/* Price and Term */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0a1128]">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 font-medium text-sm">
                      · {plan.term}
                    </span>
                  </div>

                  {/* Included Features List */}
                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Included Features:
                    </p>
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Get Started Action preselecting plan */}
                <div>
                  <Link
                    to={`/register?plan=${plan.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-base transition-all duration-200 active:scale-[0.98] ${
                      plan.isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Get Started</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
