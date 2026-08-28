/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // Proxy /kasir/* dan /absensi/* ke deployment terpisah, supaya bisa diakses
  // lewat domain utama (optikkayumanis.id/kasir) padahal jalan di project lain.
  //
  // GANTI URL DUMMY DI BAWAH dengan domain Vercel asli setelah project kasir
  // & absensi selesai di-deploy (lihat KASIR_ABSENSI_SETUP.md).
  async rewrites() {
    return [
      {
        source: "/kasir",
        destination: "https://GANTI-DENGAN-DOMAIN-KASIR.vercel.app",
      },
      {
        source: "/kasir/:path*",
        destination: "https://GANTI-DENGAN-DOMAIN-KASIR.vercel.app/:path*",
      },
      {
        source: "/absensi",
        destination: "https://GANTI-DENGAN-DOMAIN-ABSENSI.vercel.app",
      },
      {
        source: "/absensi/:path*",
        destination: "https://GANTI-DENGAN-DOMAIN-ABSENSI.vercel.app/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
