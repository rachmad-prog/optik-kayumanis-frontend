"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import LicenseModal from "../../components/LicenseModal";
import LicenseBanner from "../../components/LicenseBanner";

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </svg>
  );
}

function ProductIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BankIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ContentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function ArticleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M8 6h8M8 10h8M8 14h4" />
    </svg>
  );
}

function TrackingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const mainNavGroup = [
  { href: "/admin", label: "Dashboard", shortLabel: "Home", icon: DashboardIcon },
  { href: "/admin/products", label: "Katalog Produk", shortLabel: "Produk", icon: ProductIcon },
  { href: "/admin/orders", label: "Daftar Pesanan", shortLabel: "Pesanan", icon: OrdersIcon },
  { href: "/admin/articles", label: "Artikel & Blog", shortLabel: "Artikel", icon: ArticleIcon },
];

const managementGroup = [
  { href: "/admin/users", label: "Kelola User", shortLabel: "User", icon: UsersIcon },
  { href: "/admin/bank-accounts", label: "Rekening Bank", shortLabel: "Bank", icon: BankIcon },
  { href: "/admin/content", label: "Konten Halaman", shortLabel: "Konten", icon: ContentIcon },
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
  const [bannerKey, setBannerKey] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== "ADMIN" && user.role !== "DIREKTUR")) {
        router.push("/login?next=/admin");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== "ADMIN" && user.role !== "DIREKTUR"))
    return null;

  const allMobileLinks = [...mainNavGroup, ...managementGroup];

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12 grid md:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Sidebar — Desktop */}
        <aside className="hidden md:flex flex-col bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-obsidian flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img
                src="https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png"
                alt="Optik Kayumanis"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm text-obsidian truncate tracking-tight">
                Optik Kayumanis
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {user.role} Panel
                </span>
              </div>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-charcoal truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cinnamon text-white shrink-0">
              {user.role}
            </span>
          </div>

          {/* Nav Group: UTAMA */}
          <div className="space-y-1 mb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
              Menu Utama
            </p>
            {mainNavGroup.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-cinnamon text-white shadow-md shadow-cinnamon/20 translate-x-0.5"
                      : "text-slate-600 hover:bg-slate-100 hover:text-obsidian"
                  }`}
                >
                  <Icon className={active ? "text-white" : "text-slate-400"} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Nav Group: PENGATURAN & KONTEN */}
          <div className="space-y-1 mb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
              Manajemen &amp; Konten
            </p>
            {managementGroup.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-cinnamon text-white shadow-md shadow-cinnamon/20 translate-x-0.5"
                      : "text-slate-600 hover:bg-slate-100 hover:text-obsidian"
                  }`}
                >
                  <Icon className={active ? "text-white" : "text-slate-400"} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* 🔑 DIREKTUR SPECIAL OPTIONS */}
          {user.role === "DIREKTUR" && (
            <div className="pt-4 border-t border-slate-100 mb-5 space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
                Direktur Access
              </p>
              <Link
                href="/admin/tracking"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  pathname === "/admin/tracking"
                    ? "bg-cinnamon text-white shadow-md shadow-cinnamon/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <TrackingIcon className={pathname === "/admin/tracking" ? "text-white" : "text-slate-400"} />
                Tracking &amp; Pixel
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-left px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm"
              >
                <span>🔑</span> Lisensi Sistem
              </button>
            </div>
          )}

          {/* Quick External Link to Store */}
          <div className="pt-3 border-t border-slate-100 mt-auto space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-cinnamon hover:bg-amber-50/50 rounded-xl transition"
            >
              <span>Lihat Website Toko</span>
              <span>↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon className="text-red-400" />
              Keluar (Logout)
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0">
          <LicenseBanner
            key={bannerKey}
            token={token}
            role={user.role}
            onOpenLicenseModal={() => setIsModalOpen(true)}
          />
          {children}
        </main>

        <LicenseModal
          open={isModalOpen && user.role === "DIREKTUR"}
          onClose={() => setIsModalOpen(false)}
          token={token}
          onSuccess={() => setBannerKey((k) => k + 1)}
        />

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 pb-[env(safe-area-inset-bottom)] shadow-xl">
          <div className="flex items-center justify-around overflow-x-auto gap-1">
            {allMobileLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] text-[10px] font-bold transition-all ${
                    active
                      ? "bg-cinnamon text-white shadow-sm"
                      : "text-slate-500 hover:text-obsidian"
                  }`}
                >
                  <Icon className={active ? "text-white" : "text-slate-400"} />
                  <span className="mt-1 leading-none">{link.shortLabel}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] text-[10px] font-bold text-red-500 hover:bg-red-50"
            >
              <LogoutIcon className="text-red-400" />
              <span className="mt-1 leading-none">Keluar</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
