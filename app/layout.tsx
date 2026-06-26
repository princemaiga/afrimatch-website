import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://afrimatch.app"),
  title: {
    default: "AfriMatch | African Professional Network, Jobs, Mentorship & Community",
    template: "%s | AfriMatch | African Professional Network",
  },
  description:
    "AfriMatch is Africa's premier platform for community discovery and professional growth. Join 54 nations in one network — meet verified Africans, find jobs, access mentors, and build your career. Community is free. Professional Premium unlocks unlimited opportunities.",
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
    "AfriMatch",
    "pan-African network",
    "54 African countries",
    "African mentorship",
    "African jobs platform",
    "Africa professional network",
    "African career platform",
    "African community app",
    "Swahili network",
    "Hausa community",
    "African diaspora",
    "Africa networking app",
    "verified African profiles",
    "African business network",
    "Africa LinkedIn",
    "Africa social platform",
  ],
  authors: [{ name: "AfriMatch Team", url: "https://afrimatch.app" }],
  creator: "AfriMatch",
  publisher: "AfriMatch",
  category: "Social Networking",
  classification: "Community & Professional Network",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_SA", "sw_KE", "pt_PT", "ha_NG", "es_ES"],
    url: "https://afrimatch.app",
    siteName: "AfriMatch",
    title: "AfriMatch | African Professional Network, Jobs, Mentorship & Community",
    description:
      "Join 54 African nations on one platform. Discover your community, advance your career, find jobs and mentors. Community is free — Professional Premium unlocks everything.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AfriMatch | African Professional Network, Jobs, Mentorship & Community",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AfriMatchApp",
    creator: "@AfriMatchApp",
    title: "AfriMatch | African Professional Network, Jobs, Mentorship & Community",
    description:
      "54 countries. 7 languages. One platform. Community is free. Professional Premium for career growth across Africa and the diaspora.",
    images: [
      {
        url: "/og-image.jpg",
        alt: "AfriMatch | African Professional Network, Jobs, Mentorship & Community",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#f59e0b" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://afrimatch.app",
    languages: {
      "en": "https://afrimatch.app",
      "fr": "https://afrimatch.app",
      "ar": "https://afrimatch.app",
      "sw": "https://afrimatch.app",
      "pt": "https://afrimatch.app",
      "ha": "https://afrimatch.app",
      "es": "https://afrimatch.app",
    },
  },
  verification: {
    google: "afrimatch-google-site-verification",
  },
  appLinks: {
    web: {
      url: "https://afrimatch.app",
      should_fallback: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="theme-color" content="#f59e0b" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080d1a" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AfriMatch" />
        <meta name="application-name" content="AfriMatch" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AfriMatch",
              alternateName: "AfriMatch Network",
              url: "https://afrimatch.app",
              logo: {
                "@type": "ImageObject",
                url: "https://afrimatch.app/android-chrome-512x512.png",
                width: 512,
                height: 512,
              },
              description:
                "AfriMatch connects African professionals, employers, mentors, learners and communities across Africa and the global diaspora through jobs, courses, mentorship and trusted community discovery.",
              foundingDate: "2024",
              areaServed: "Africa",
              serviceType: ["Community Networking", "Professional Networking", "Career Development", "Mentorship"],
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
                availableLanguage: ["English", "French", "Arabic", "Swahili", "Portuguese", "Hausa", "Spanish"],
              },
              offers: [
                {
                  "@type": "Offer",
                  name: "Community Plan",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free community access — connect with Africans across 54 countries",
                },
                {
                  "@type": "Offer",
                  name: "Professional Premium",
                  description: "Unlimited job applications, courses, mentorship, and career tools",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AfriMatch",
              url: "https://afrimatch.app",
              description: "African Professional Network, Jobs, Mentorship & Community",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://afrimatch.app/community?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#080d1a]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
