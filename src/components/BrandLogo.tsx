import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'auto' | 'dark' | 'light' | 'original' | 'pill';
  showWordmark?: boolean;
}

export const BrandMark: React.FC<{
  sizeClass?: string;
  className?: string;
  variant?: 'dark' | 'light';
}> = ({
  sizeClass = "w-10 h-10",
  className = "",
  variant = 'dark',
}) => {
  const src = variant === 'light' ? '/aedvix-emblem-light.png' : '/aedvix-emblem-dark.png';
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <img
        src={src}
        alt="AEDVIX Emblem"
        className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(109,40,217,0.35)]"
      />
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  variant = 'auto',
  showWordmark = true,
}) => {
  // Height sizing for the official logo
  const heightSizes = {
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // If wordmark is not requested, just show the emblem
  if (!showWordmark) {
    return (
      <BrandMark
        sizeClass={emblemSizes[size]}
        className={className}
        variant={variant === 'light' ? 'light' : 'dark'}
      />
    );
  }

  // Pill variant: Original logo on an elegant white rounded pill badge
  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center bg-white px-3.5 py-1.5 rounded-2xl shadow-md border border-white/20 select-none ${className}`}>
        <img
          src="/aedvix-logo-light.png"
          alt="AEDVIX"
          className={`${heightSizes[size]} w-auto object-contain`}
        />
      </div>
    );
  }

  // Auto/Dark: Uses the dark-background transparent version where the 'A' and 'edvix' are crisp white
  // with the purple cap/book and cyan dot perfectly preserved.
  const logoSrc = variant === 'light' ? '/aedvix-logo-light.png' : '/aedvix-logo-dark.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="AEDVIX"
        className={`${heightSizes[size]} w-auto object-contain drop-shadow-[0_2px_12px_rgba(109,40,217,0.3)]`}
      />
    </div>
  );
};
