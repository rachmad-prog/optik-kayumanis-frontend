"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import LicenseModal from "../../components/LicenseModal";
import LicenseBanner from "../../components/LicenseBanner";

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </svg>
  );
}

function ProductIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16.5 6.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M21 20c0-2.6-1.7-4.6-4-5.3" />
    </svg>
  );
}

function BankIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9M9 10v9M15 10v9M19 10v9" />
      <path d="M3 21h18" />
    </svg>
  );
}

function ContentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10M7 13h10M7 17h6" />
    </svg>
  );
}

function ArticleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M4 4h16v4H4zM4 12h10M4 16h6" />
      <path d="M14 14l2 2 4-4" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

const links = [
  { href: "/admin", label: "Dashboard", shortLabel: "Dashboard", icon: DashboardIcon },
  { href: "/admin/products", label: "Produk", shortLabel: "Produk", icon: ProductIcon },
  { href: "/admin/orders", label: "Pesanan", shortLabel: "Pesanan", icon: OrdersIcon },
  { href: "/admin/users", label: "Kelola User", shortLabel: "User", icon: UsersIcon },
  { href: "/admin/bank-accounts", label: "Rekening Bank", shortLabel: "Rekening", icon: BankIcon },
  { href: "/admin/content", label: "Konten Halaman", shortLabel: "Konten", icon: ContentIcon },
  { href: "/admin/articles", label: "Artikel", shortLabel: "Artikel", icon: ArticleIcon },
];

export default function AdminLayout({ children }) {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push("/login");
  }

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
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 pb-24 md:pb-10 grid md:grid-cols-[220px_1fr] gap-8">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:block space-y-1 md:sticky md:top-10 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
        <p className="font-display text-lg text-bark-700 mb-4">Admin Panel</p>

        {/* Menu Navigasi Utama */}
        <div className="space-y-1 mb-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium ${
                  pathname === link.href
                    ? "bg-cinnamon-500 text-white"
                    : "text-bark-500 hover:bg-sand"
                }`}>
                <Icon />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* 🔑 TOMBOL LISENSI DAN TOKEN (HANYA MUNCUL DI SIDEBAR JIKA ROLE = DIREKTUR) */}
        {user.role === "DIREKTUR" && (
          <div className="pt-4 border-t border-sand mb-4 space-y-2">
            <Link
              href="/admin/tracking"
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium ${
                pathname === "/admin/tracking"
                  ? "bg-cinnamon-500 text-white"
                  : "text-bark-500 hover:bg-sand"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                <path d="M13 13l6 6" />
              </svg>
              Tracking &amp; Pixel
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-4 py-2.5 bg-cinnamon-600 hover:bg-cinnamon-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2">
              <span>🔑</span> Lisensi Sistem
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="pt-4 border-t border-sand">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
            <LogoutIcon />
            Logout
          </button>
        </div>
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

      {/* Bottom tab bar — mobile only, app-style navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-sand pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-8">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${
                  active ? "text-cinnamon-600" : "text-bark-400"
                }`}>
                <Icon className={active ? "text-cinnamon-600" : "text-bark-400"} />
                <span className="leading-none text-center">{link.shortLabel}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium text-red-500">
            <LogoutIcon />
            <span className="leading-none">Keluar</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
