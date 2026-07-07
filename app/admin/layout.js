"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import LicenseModal from "../../components/LicenseModal";
import LicenseBanner from "../../components/LicenseBanner";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/users", label: "Kelola User" },
  { href: "/admin/content", label: "Konten Halaman" },
];

export default function AdminLayout({ children }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // State untuk modal lisensi direktur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerKey, setBannerKey] = useState(0); // dipakai untuk refresh LicenseBanner setelah update sukses

  useEffect(() => {
    // 🔑 IZINKAN ADMIN DAN DIREKTUR MASUK
    if (!loading) {
      if (!user || (user.role !== "ADMIN" && user.role !== "DIREKTUR")) {
        router.push("/login?next=/admin");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== "ADMIN" && user.role !== "DIREKTUR"))
    return null;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="font-display text-lg text-bark-700 mb-4">Admin Panel</p>

        {/* Menu Navigasi Utama */}
        <div className="space-y-1 mb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-xl text-sm font-medium ${
                pathname === link.href
                  ? "bg-cinnamon-500 text-white"
                  : "text-bark-500 hover:bg-sand"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* 🔑 TOMBOL LISENSI DAN TOKEN (HANYA MUNCUL DI SIDEBAR JIKA ROLE = DIREKTUR) */}
        {user.role === "DIREKTUR" && (
          <div className="pt-4 border-t border-sand">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-4 py-2.5 bg-cinnamon-600 hover:bg-cinnamon-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2">
              <span>🔑</span> Lisensi Sistem
            </button>
          </div>
        )}
      </aside>

      <div>
        <LicenseBanner
          key={bannerKey}
          token={token}
          role={user.role}
          onOpenLicenseModal={() => setIsModalOpen(true)}
        />
        {children}
      </div>

      <LicenseModal
        open={isModalOpen && user.role === "DIREKTUR"}
        onClose={() => setIsModalOpen(false)}
        token={token}
        onSuccess={() => setBannerKey((k) => k + 1)}
      />
    </div>
  );
}
