import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { taglines, copyright } = siteConfig.brand;
  const { footerLinks } = siteConfig.navigation;

  return (
    <footer className="bg-[#060a14] text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12">
          {/* Left: Brand mark, wordmark, and two muted tagline lines */}
          <div className="flex flex-col items-start space-y-3 max-w-sm">
            <Link to="/" className="focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1" aria-label="AEDVIX Home">
              <BrandLogo size="md" />
            </Link>
            <div className="pt-2 space-y-1">
              <p className="text-sm font-medium text-slate-400">
                {taglines[0]}
              </p>
              <p className="text-sm font-semibold text-slate-300">
                {taglines[1]}
              </p>
            </div>
          </div>

          {/* Right on Desktop: Home, About, Programs, Register, Contact */}
          <nav
            className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end"
            aria-label="Footer Navigation"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 rounded py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Thin muted divider */}
        <div className="border-t border-slate-800/90 pt-8 mt-2">
          {/* Reference copyright and location line */}
          <p className="text-xs sm:text-sm text-slate-400 text-center md:text-left">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
