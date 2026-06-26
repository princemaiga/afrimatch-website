import { Metadata } from "next";

export const baseMetadata: Metadata = {
  title: "AfriMatch - Africa's Community & Professional Network",
  description:
    "Connect with Africans across 54 countries. Build authentic community connections, advance your career, and grow your professional network. Join AfriMatch free today.",
  keywords: [
    "African community platform",
    "professional networking Africa",
    "African social network",
    "connect with Africans",
    "career networking Africa",
    "African professionals",
    "community platform Africa",
    "African diaspora network",
    "job platform Africa",
    "social networking Africa",
    "African mentorship",
    "AfriMatch",
  ],
  authors: [{ name: "AfriMatch Team" }],
  creator: "AfriMatch",
  publisher: "AfriMatch",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://afrimatch.app",
    siteName: "AfriMatch",
    title: "AfriMatch - Africa's Community & Professional Network",
    description:
      "Connect with Africans across 54 countries. Build authentic community connections and advance your career on one platform.",
    images: [
      {
        url: "https://afrimatch.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AfriMatch - Africa's Community & Professional Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AfriMatch - Africa's Community & Professional Network",
    description:
      "Connect with Africans across 54 countries. Build authentic community connections and advance your career on one platform.",
    images: ["https://afrimatch.app/og-image.jpg"],
    creator: "@AfriMatch",
  },
  alternates: {
    canonical: "https://afrimatch.app",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#f59e0b",
};

export const pageMetadata = {
  home: {
    title: "AfriMatch - Africa's Community & Professional Network",
    description:
      "Join AfriMatch — Africa's platform for authentic community connections and professional growth. Connect across 54 countries, find career opportunities, and build your network.",
  },
  pricing: {
    title: "Pricing Plans - AfriMatch Professional Subscriptions",
    description:
      "Community is always free on AfriMatch. Upgrade to Professional plans to unlock unlimited job applications, courses, mentorship, and more.",
  },
  signup: {
    title: "Sign Up - Join AfriMatch Today",
    description:
      "Create your free AfriMatch account. Join the community, build your professional profile, or both. Start connecting in minutes.",
  },
  signin: {
    title: "Sign In - AfriMatch",
    description: "Log in to your AfriMatch account and continue connecting with your community and professional network.",
  },
  dashboard: {
    title: "Dashboard - AfriMatch",
    description: "Manage your profile, messages, connections, and subscriptions on AfriMatch.",
  },
  about: {
    title: "About AfriMatch - Our Mission",
    description:
      "Learn about AfriMatch's mission to connect Africans across 54 countries through community and professional growth.",
  },
  help: {
    title: "Help Center - AfriMatch Support",
    description: "Find answers to common questions about AfriMatch. Browse our comprehensive help documentation.",
  },
  privacy: {
    title: "Privacy Policy - AfriMatch",
    description: "Learn how AfriMatch protects your privacy and handles your personal data.",
  },
  terms: {
    title: "Terms of Service - AfriMatch",
    description: "Read our terms of service and community guidelines for using AfriMatch.",
  },
  community: {
    title: "Community - Browse Members | AfriMatch",
    description:
      "Discover verified Africans across 54 countries. Connect authentically with people who share your values, culture, and interests.",
  },
  professional: {
    title: "Professional Network - Jobs, Courses & Mentors | AfriMatch",
    description:
      "Find jobs, take certified courses, and connect with mentors across Africa. Build your professional presence on AfriMatch.",
  },
};

// Structured data for rich snippets
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AfriMatch",
    url: "https://afrimatch.app",
    logo: "https://afrimatch.app/images/afrimatch-logo.png",
    description:
      "Africa's community and professional networking platform connecting people across 54 African nations",
    sameAs: [
      "https://www.facebook.com/afrimatch",
      "https://www.instagram.com/afrimatch",
      "https://www.twitter.com/afrimatch",
      "https://www.linkedin.com/company/afrimatch",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@afrimatch.app",
      url: "https://afrimatch.app/help",
    },
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AfriMatch",
    url: "https://afrimatch.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://afrimatch.app/search?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  },

  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AfriMatch",
    description:
      "Community and professional networking platform for Africa — connecting 54 nations",
    url: "https://afrimatch.app",
    applicationCategory: "SocialNetworkingApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    
  },
};

// SEO keywords by category
export const seoKeywords = {
  community: [
    "African community platform",
    "connect with Africans",
    "African social network",
    "African diaspora community",
    "meet Africans online",
    "African cultural connections",
    "African community app",
    "verified African profiles",
    "African networking platform",
    "social platform Africa",
    "African connections",
    "community platform Africa",
    "African professional network",
    "authentic African connections",
    "pan-African community",
  ],
  professional: [
    "professional networking Africa",
    "job platform Africa",
    "career networking",
    "African professionals",
    "job search Africa",
    "career development Africa",
    "business networking",
    "professional connections",
    "LinkedIn alternative Africa",
    "African job board",
    "career opportunities Africa",
    "professional growth Africa",
    "mentorship platform",
    "business connections Africa",
    "African career platform",
  ],
  general: [
    "AfriMatch",
    "AfriMatch app",
    "AfriMatch professional",
    "AfriMatch community",
    "dual mode platform",
    "Africa tech startup",
    "African innovation",
    "social platform Africa",
    "community platform Africa",
    "pan-African platform",
    "54 African countries",
    "African diaspora network",
  ],
};

// Meta tags for different pages
export function getPageMetaTags(page: string) {
  const tags = pageMetadata[page as keyof typeof pageMetadata];
  return tags || baseMetadata;
}

// Generate sitemap URLs
export const sitemapUrls = [
  { url: "https://afrimatch.app", changefreq: "daily", priority: 1.0 },
  { url: "https://afrimatch.app/community", changefreq: "daily", priority: 0.9 },
  { url: "https://afrimatch.app/pricing", changefreq: "weekly", priority: 0.9 },
  { url: "https://afrimatch.app/auth/signup", changefreq: "monthly", priority: 0.8 },
  { url: "https://afrimatch.app/auth/signin", changefreq: "monthly", priority: 0.8 },
  { url: "https://afrimatch.app/professional/jobs", changefreq: "daily", priority: 0.8 },
  { url: "https://afrimatch.app/professional/courses", changefreq: "weekly", priority: 0.7 },
  { url: "https://afrimatch.app/professional/mentors", changefreq: "weekly", priority: 0.7 },
  { url: "https://afrimatch.app/about", changefreq: "monthly", priority: 0.7 },
  { url: "https://afrimatch.app/help", changefreq: "weekly", priority: 0.7 },
  { url: "https://afrimatch.app/privacy", changefreq: "monthly", priority: 0.6 },
  { url: "https://afrimatch.app/terms", changefreq: "monthly", priority: 0.6 },
  { url: "https://afrimatch.app/blog", changefreq: "daily", priority: 0.8 },
];
