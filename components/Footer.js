"use client";

import Link from "next/link";
import { DEFAULT_CONTENT } from "../lib/defaultContent";
import { normalizeExternalUrl, toMapEmbedSrc } from "../lib/media";
import { useLanguage } from "../context/LanguageContext";

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.2H7v3.2h2.8V21h3.7Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16.5 3c.4 2.1 1.8 3.5 4 3.8v3c-1.4 0-2.8-.4-4-1.2v6.1c0 3.2-2.6 5.3-5.4 5.3-2.9 0-5.1-2.2-5.1-5s2.3-5 5.1-5c.4 0 .8 0 1.1.1v3.1a2.3 2.3 0 0 0-1.1-.3c-1.2 0-2.2 1-2.2 2.1s1 2.1 2.2 2.1c1.3 0 2.4-1 2.4-2.5V3h3Z" />
    </svg>
  ),
};

export default function Footer({ content }) {
  const { t } = useLanguage();
  const footer = content?.footer || DEFAULT_CONTENT.footer;
  const mapSrc = toMapEmbedSrc(footer.mapEmbed);

  return (
    <footer className="bg-obsidian-950 text-slate-300 mt-20 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-champagne flex items-center justify-center text-lg shadow-glow overflow-hidden">
              <img
                src="https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png"
                alt="Optik Kayumanis"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <p className="font-extrabold text-lg text-white tracking-tight">Optik Kayumanis</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {footer.description || "Penyedia solusi penglihatan dan eyewear premium dengan standar pemeriksaan optik presisi tinggi."}
          </p>
          <div className="flex gap-3">
            {["instagram", "facebook", "tiktok"].map((key) => (
              <a
                key={key}
                href={normalizeExternalUrl(footer.socials?.[key])}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center hover:bg-champagne hover:text-obsidian transition duration-300 border border-slate-700"
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">Navigasi Katalog</p>
          <ul className="space-y-3 text-xs">
            <li><Link href="/" className="hover:text-champagne transition">{t("home")}</Link></li>
            <li><Link href="/store" className="hover:text-champagne transition">✨ {t("store")} 2026</Link></li>
            <li><Link href="/store?category=kacamata-optik" className="hover:text-champagne transition">{t("opticalGlasses")}</Link></li>
            <li><Link href="/store?category=lensa-kontak" className="hover:text-champagne transition">{t("contactLenses")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">{t("account")}</p>
          <ul className="space-y-3 text-xs">
            <li><Link href="/account" className="hover:text-champagne transition">{t("myOrders")}</Link></li>
            <li><Link href="/login" className="hover:text-champagne transition">{t("login")}</Link></li>
            <li><Link href="/register" className="hover:text-champagne transition">{t("registerAccount")}</Link></li>
          </ul>
          <p className="font-extrabold text-xs text-champagne uppercase tracking-wider mt-6 mb-3">{t("operatingHours")}</p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {(footer.hours || []).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-extrabold text-sm text-white uppercase tracking-wider mb-5">{t("location")}</p>
          <p className="text-xs text-slate-400 mb-2 leading-relaxed">{footer.address}</p>
          <p className="text-xs text-slate-400 mb-1">WhatsApp: <span className="text-white font-medium">{footer.whatsappDisplay}</span></p>
          <p className="text-xs text-slate-400 mb-4">Email: <span className="text-white font-medium">{footer.email}</span></p>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              className="aspect-video rounded-2xl w-full border border-slate-800"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
              {t("mapLocation")}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {footer.copyrightText || `Optik Kayumanis. ${t("allRightsReserved")}`}
      </div>
    </footer>
  );
}
