"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const mainNavLinks = [
  { href: "/", key: "home" },
  { href: "/#tentang", key: "about" },
  { href: "/#layanan", key: "services" },
  { href: "/#cabang", key: "branches" },
  { href: "/#kontak", key: "contact" },
];

const storeLinks = [
  { href: "/store", key: "catalog" },
  { href: "/store?category=kacamata-optik", key: "opticalGlasses" },
  { href: "/store?category=lensa-kontak", key: "contactLenses" },
];

function CartIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Navbar({ content }) {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const topbar = content?.hero || {};

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="bg-obsidian text-slate-300 text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-1.5 flex justify-between items-center gap-3">
          <p className="hidden sm:flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            {topbar.topbarLeft || "Periksa Mata Gratis di Seluruh Cabang Kayumanis • Tren Frame 2026"}
          </p>
          <p className="mx-auto sm:mx-0 sm:mr-auto sm:ml-4 truncate font-medium text-slate-400">
            {topbar.topbarRight || "Garansi Lensa Presisi 100% Original"}
          </p>
          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-champagne hover:text-obsidian text-slate-200 font-bold transition duration-200"
          >
            <GlobeIcon />
            <span className="tracking-wider">{lang === "en" ? "EN" : "ID"}</span>
          </button>
        </div>
      </div>

      {/* Main Glass Floating Nav */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-obsidian flex items-center justify-center shadow-lg shadow-obsidian/20 group-hover:scale-105 transition-transform duration-300 border border-slate-800 overflow-hidden">
              <img
                src="https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png"
                alt="Optik Kayumanis"
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-obsidian flex items-center gap-1">
                Optik Kayumanis
                <span className="text-champagne font-light">.</span>
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <ul className="hidden lg:flex items-center gap-8 text-xs uppercase font-extrabold tracking-wider text-slate-700">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-champagne-600 transition-colors py-2 relative group"
                >
                  {t(link.key)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-champagne transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/store"
                className="px-4 py-2 rounded-full bg-obsidian text-white hover:bg-champagne hover:text-obsidian transition-all shadow-md duration-300 flex items-center gap-1.5"
              >
                <span>✨ {t("store")} 2026</span>
              </Link>
            </li>
          </ul>

          {/* Right Action Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-slate-100 text-obsidian hover:bg-champagne-100 hover:text-champagne-700 transition-colors"
              aria-label={`${t("cart")}, ${totalQuantity} item`}
            >
              <CartIcon />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-champagne-gold text-obsidian text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                <Link
                  href="/account"
                  className="text-xs font-bold text-obsidian hover:text-champagne-600"
                >
                  {t("hi")}, {user.name.split(" ")[0]}
                </Link>

                {(user.role === "ADMIN" || user.role === "DIREKTUR") && (
                  <Link
                    href="/admin"
                    className="text-xs font-bold text-champagne-600 hover:underline"
                  >
                    {t("admin")}
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 transition"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full border border-obsidian text-obsidian hover:bg-obsidian hover:text-white transition-all shadow-sm"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-obsidian"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka Menu Navigasi"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-5 py-6 space-y-4 animate-fadeIn">
            <ul className="flex flex-col gap-3 text-sm font-bold text-obsidian">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 border-b border-slate-100 hover:text-champagne-600"
                    onClick={() => setOpen(false)}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/store"
                  className="block py-3 px-4 rounded-xl bg-obsidian text-white text-center font-extrabold"
                  onClick={() => setOpen(false)}
                >
                  ✨ Katalog Store 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex items-center justify-between py-2 border-b border-slate-100"
                  onClick={() => setOpen(false)}
                >
                  <span>{t("cart")}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-champagne text-obsidian text-xs font-bold">
                    {totalQuantity} item
                  </span>
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="block py-2 text-slate-600"
                      onClick={() => setOpen(false)}
                    >
                      {t("myAccount")}
                    </Link>
                  </li>
                  {(user.role === "ADMIN" || user.role === "DIREKTUR") && (
                    <li>
                      <Link
                        href="/admin"
                        className="block py-2 text-champagne-600 font-bold"
                        onClick={() => setOpen(false)}
                      >
                        {t("admin")}
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={logout}
                      className="text-left py-2 text-red-500 font-semibold w-full"
                    >
                      {t("logout")}
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-2">
                  <Link
                    href="/login"
                    className="block text-center py-3 rounded-xl border border-obsidian text-obsidian font-bold"
                    onClick={() => setOpen(false)}
                  >
                    {t("login")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
