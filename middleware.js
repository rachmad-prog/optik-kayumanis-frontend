import { NextResponse } from "next/server";

// Halaman/rute yang TETAP BISA diakses walau lisensi kadaluarsa:
// - /admin/*  -> panel admin (ADMIN/DIREKTUR tetap harus bisa masuk untuk memperpanjang lisensi)
// - /login, /register -> supaya Direktur/Admin tetap bisa login dulu
// - /license-expired -> halaman blokir itu sendiri (hindari redirect loop)
// - /_next, /favicon.ico -> aset internal Next.js
const EXEMPT_PREFIXES = [
  "/admin",
  "/login",
  "/register",
  "/license-expired",
  "/_next",
  "/favicon.ico",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${API_URL}/license/public-status`, {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.isBlocked) {
      const url = request.nextUrl.clone();
      url.pathname = "/license-expired";
      return NextResponse.rewrite(url);
    }
  } catch {
    // Kalau gagal cek (mis. backend sedang cold-start / network hiccup),
    // JANGAN blokir seluruh website hanya gara-gara itu — fail open.
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan middleware untuk semua path KECUALI file statis (gambar, css, js bawaan Next.js)
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
};
