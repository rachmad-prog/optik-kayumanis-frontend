const SITE_URL = (process.env.NEXT_PUBLIC_CLIENT_URL || "https://optikkayumanis.id").replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/checkout",
          "/cart",
          "/login",
          "/register",
          "/track-order",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
