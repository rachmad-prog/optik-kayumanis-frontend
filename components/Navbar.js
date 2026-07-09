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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
      aria-hidden="true"
      {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="15"
      height="15"
      aria-hidden="true"
      {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  );
}

function ChevronDownIcon(props) {
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
      {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar({ content }) {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const topbar = content?.hero || {};

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-charcoal text-cream/80 text-xs">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex justify-between items-center gap-3">
          <p className="hidden sm:block">{topbar.topbarLeft}</p>
          <p className="mx-auto sm:mx-0 sm:mr-auto sm:ml-4 truncate">
            {topbar.topbarRight}
          </p>
          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cream/20 hover:border-cream/50 hover:text-cream transition">
            <GlobeIcon />
            <span className="font-semibold tracking-wide">
              {lang === "en" ? "EN" : "ID"}
            </span>
          </button>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-cream/95 backdrop-blur border-b border-beige">
        <nav className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-10 h-10 rounded-full bg-cinnamon flex items-center justify-center text-cream font-bold text-lg">
              OK
            </span>
            <span className="leading-tight">
              <p className="font-extrabold text-lg tracking-tight text-charcoal">
                Optik Kayumanis
              </p>
              <p className="text-[10px] uppercase tracking-widest text-warmgray">
                Eyewear &amp; Eyecare
              </p>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-charcoal">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-cinnamon transition-colors">
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li className="relative group">
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 hover:text-cinnamon transition-colors">
                {t("store")}
                {/* <ChevronDownIcon /> */}
              </Link>
              {/* <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 absolute right-0 top-full pt-4 transition">
                <ul className="w-52 rounded-xl border border-beige bg-cream shadow-xl p-2 text-sm">
                  {storeLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-3 py-2 hover:bg-cinnamon/10 hover:text-cinnamon transition-colors">
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/cart"
              className="relative text-charcoal hover:text-cinnamon transition-colors"
              aria-label={`${t("cart")}, ${totalQuantity} item`}>
              <CartIcon />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-cinnamon text-cream text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="text-sm font-semibold text-charcoal hover:text-cinnamon">
                  {t("hi")}, {user.name.split(" ")[0]}
                </Link>

                {(user.role === "ADMIN" || user.role === "DIREKTUR") && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-cinnamon hover:text-cinnamon-700">
                    {t("admin")}
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="text-sm font-semibold text-warmgray hover:text-cinnamon">
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-charcoal/20 hover:border-cinnamon hover:text-cinnamon transition">
                {t("login")}
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-charcoal"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
            aria-expanded={open}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-beige bg-cream px-5 pb-4">
            <ul className="flex flex-col gap-1 pt-2 text-sm font-medium text-charcoal">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2"
                    onClick={() => setOpen(false)}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/store"
                  className="block py-2 font-bold text-charcoal"
                  onClick={() => setOpen(false)}>
                  {t("store")}
                </Link>
                <ul className="pl-4 border-l border-beige">
                  {storeLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block py-2 text-warmgray"
                        onClick={() => setOpen(false)}>
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="block py-2"
                  onClick={() => setOpen(false)}>
                  {t("cart")} ({totalQuantity})
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="block py-2"
                      onClick={() => setOpen(false)}>
                      {t("myAccount")}
                    </Link>
                  </li>

                  {(user.role === "ADMIN" || user.role === "DIREKTUR") && (
                    <li>
                      <Link
                        href="/admin"
                        className="block py-2 text-cinnamon"
                        onClick={() => setOpen(false)}>
                        {t("admin")}
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={logout}
                      className="text-left py-2 text-warmgray w-full">
                      {t("logout")}
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-2">
                  <Link
                    href="/login"
                    className="block text-center py-2 rounded-full border border-charcoal/20 text-sm font-semibold"
                    onClick={() => setOpen(false)}>
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
