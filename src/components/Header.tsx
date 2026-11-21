import React, { useState } from 'react';
import { NavLink as RouterNavLink, Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { headerLinks, registerAction } = siteConfig.navigation;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060a14]/90 backdrop-blur-md border-b border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Wordmark linking to Home */}
          <Link
            to="/"
            className="flex items-center focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
            aria-label="AEDVIX Home"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Right on Desktop: Navigation Links & Register Now Button */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-7" aria-label="Main Navigation">
              {headerLinks.map((item) => (
                <RouterNavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 ${
                      isActive
                        ? 'text-blue-400 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </RouterNavLink>
              ))}
            </nav>

            {/* Desktop Register Now Action */}
            <Link
              to={registerAction.path}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] group"
            >
              <span>{registerAction.label}</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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

          {/* Mobile Right Controls: Register action + Accessible Menu Toggle */}
          <div className="flex md:hidden items-center gap-2.5">
            <Link
              to={registerAction.path}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
            >
              <span>{registerAction.label}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-[#060a14]/98 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {headerLinks.map((item) => (
              <RouterNavLink
                key={item.label}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-slate-900/80 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {item.label}
              </RouterNavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
