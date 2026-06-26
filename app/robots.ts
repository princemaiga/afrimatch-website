import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/auth/profile-setup",
          "/influencer/dashboard",
        ],
      },
    ],
    sitemap: "https://afrimatch.app/sitemap.xml",
    host: "https://afrimatch.app",
  };
}
