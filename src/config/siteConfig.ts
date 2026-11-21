export interface NavLink {
  label: string;
  path: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: 'lightbulb' | 'mentorship' | 'practical' | 'community';
}

export interface ProgramPlan {
  id: string;
  name: string;
  price: string;
  term: string;
  priceAndTerm: string;
  features: string[];
  isPopular?: boolean;
  enabled: boolean;
}

export interface SiteConfig {
  brand: {
    name: string;
    wordmark: string;
    heroHeading: string;
    eyebrow: string;
    taglines: string[];
    locationLine: string;
    copyright: string;
  };
  navigation: {
    headerLinks: NavLink[];
    footerLinks: NavLink[];
    registerAction: {
      label: string;
      path: string;
    };
    exploreProgramsAction: {
      label: string;
      path: string;
    };
  };
  hero: {
    eyebrow: string;
    brandName: string;
    headline: string;
    supportingText: string;
  };
  features: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    cards: FeatureCard[];
  };
  about: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    introTitle: string;
    introDescription: string;
    pillars: {
      title: string;
      description: string;
    }[];
    teamPlaceholder: string;
  };
  programs: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    plans: ProgramPlan[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    location: string;
    unconfiguredChannelsNotice: string;
    email?: string | null;
    phone?: string | null;
  };
  register: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    sidePanel: {
      tagline: string;
      title: string;
      description: string;
    };
    formHeading: string;
    disclaimerNote: string;
    guardianConsentText: string;
    privacyConsentText: string;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "AEDVIX",
    wordmark: "AEDVIX",
    heroHeading: "Aedvix",
    eyebrow: "EDUCATION × ADVICE × TECHNOLOGY",
    taglines: [
      "Education × Advice × Technology",
      "Learn. Build. Lead."
    ],
    locationLine: "Shirpur, Maharashtra, India.",
    copyright: "© 2026 AEDVIX. Shirpur, Maharashtra, India."
  },
  navigation: {
    headerLinks: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Programs", path: "/programs" },
      { label: "Contact", path: "/contact" },
    ],
    footerLinks: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Programs", path: "/programs" },
      { label: "Register", path: "/register" },
      { label: "Contact", path: "/contact" },
    ],
    registerAction: {
      label: "Register Now",
      path: "/register",
    },
    exploreProgramsAction: {
      label: "Explore Programs",
      path: "/programs",
    },
  },
  hero: {
    eyebrow: "EDUCATION × ADVICE × TECHNOLOGY",
    brandName: "Aedvix",
    headline: "Building Next-Gen Tech, One Student at a Time.",
    supportingText: "From Shirpur to what’s next: explore startup thinking, AI, coding, website development, designing, digital skills and more through a student-focused learning platform.",
  },
  features: {
    eyebrow: "A PLACE TO GET STARTED",
    heading: "Why Choose Aedvix ?",
    subtitle: "Learn useful skills, build confidence, and find your next direction.",
    cards: [
      {
        title: "Startup Education",
        icon: "lightbulb",
        description: "Explore how ideas become real-world projects and businesses.",
      },
      {
        title: "Expert Mentorship",
        icon: "mentorship",
        description: "Learn with guidance designed to help you move forward.",
      },
      {
        title: "Practical Learning",
        icon: "practical",
        description: "Develop hands-on skills you can put into practice.",
      },
      {
        title: "Strong Community",
        icon: "community",
        description: "Connect with others who are curious about building the future.",
      },
    ],
  },
  about: {
    eyebrow: "WHO WE ARE",
    heading: "About Us",
    subtitle: "Empowering the next generation of innovators and entrepreneurs.",
    introTitle: "About Aedvix",
    introDescription: "AEDVIX is a student learning platform based in Shirpur. We bring together technology, business, startup education, and creative digital skills in one place.",
    pillars: [
      {
        title: "Our Mission",
        description: "To make quality technology, business and startup education accessible to students.",
      },
      {
        title: "Our Vision",
        description: "To build a learning ecosystem where students can develop skills, explore ideas and create their own future.",
      },
      {
        title: "Our Purpose",
        description: "To give students room to learn, innovate, and build across Startup & Business, AI, Coding, Website Development, Designing, Digital Skills, and more.",
      },
    ],
    teamPlaceholder: "Meet the people behind AEDVIX when verified team profiles become available.",
  },
  programs: {
    eyebrow: "OUR PROGRAMS",
    heading: "Choose the Plan That Fits Your Journey",
    subtitle: "Choose a learning path that works for you.",
    plans: [
      {
        id: "basic",
        name: "Basic Plan",
        price: "₹999",
        term: "4 Months",
        priceAndTerm: "₹999 · 4 Months",
        features: [
          "Core Startup Learning",
          "Live Sessions Access",
          "Community Support",
        ],
        isPopular: false,
        enabled: true,
      },
      {
        id: "premium",
        name: "Premium Plan",
        price: "₹1,999",
        term: "1 Year",
        priceAndTerm: "₹1,999 · 1 Year",
        features: [
          "All Basic Features",
          "One-on-One Mentorship",
          "Priority Support",
        ],
        isPopular: true,
        enabled: true,
      },
    ],
  },
  contact: {
    eyebrow: "GET IN TOUCH",
    heading: "Contact",
    subtitle: "Have a question about AEDVIX? Send an enquiry and share what you’d like to know.",
    location: "Shirpur, Maharashtra, India",
    unconfiguredChannelsNotice: "Contact details coming soon",
    email: null, // Keep configurable; when null, shows honest unconfiguredChannelsNotice
    phone: null, // Keep configurable; when null, shows honest unconfiguredChannelsNotice
  },
  register: {
    eyebrow: "STUDENT REGISTRATION",
    heading: "Start Your Journey",
    subtitle: "Tell us a little about yourself and the plan you’re interested in.",
    sidePanel: {
      tagline: "LEARN. BUILD. LEAD.",
      title: "Join AEDVIX",
      description: "Register now and unlock limitless learning opportunities.",
    },
    formHeading: "Student Registration",
    disclaimerNote: "Fields marked * are required. Registration is an expression of interest, not a payment or confirmed enrolment.",
    guardianConsentText: "I confirm that a parent or guardian has consented to this registration if the student is under 18.",
    privacyConsentText: "I agree to the processing of this expression of interest in accordance with the Privacy Notice.",
  },
};
