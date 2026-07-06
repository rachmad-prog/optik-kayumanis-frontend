"use client";

import Link from "next/link";
import { DEFAULT_CONTENT } from "../lib/defaultContent";
import { normalizeExternalUrl, toMapEmbedSrc } from "../lib/media";
import { useLanguage } from "../context/LanguageContext";

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
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
    <footer className="bg-charcoal text-cream/80 mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-full bg-cinnamon flex items-center justify-center text-cream font-bold">
              OK
            </span>
            <p className="font-extrabold text-cream">Optik Kayumanis</p>
          </div>
          <p className="text-sm mb-4">{footer.description}</p>
          <div className="flex gap-3">
            {["instagram", "facebook", "tiktok"].map((key) => (
              <a
                key={key}
                href={normalizeExternalUrl(footer.socials?.[key])}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cinnamon transition"
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold text-cream mb-4">{t("navigation")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-cinnamon">{t("home")}</Link></li>
            <li><Link href="/shop" className="hover:text-cinnamon">{t("catalog")}</Link></li>
            <li><Link href="/shop?category=kacamata-optik" className="hover:text-cinnamon">{t("opticalGlasses")}</Link></li>
            <li><Link href="/shop?category=lensa-kontak" className="hover:text-cinnamon">{t("contactLenses")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-cream mb-4">{t("account")}</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/account" className="hover:text-cinnamon">{t("myOrders")}</Link></li>
            <li><Link href="/login" className="hover:text-cinnamon">{t("login")}</Link></li>
            <li><Link href="/register" className="hover:text-cinnamon">{t("registerAccount")}</Link></li>
          </ul>
          <p className="font-bold text-cream mt-6 mb-2">{t("operatingHours")}</p>
          <ul className="space-y-1 text-sm">
            {(footer.hours || []).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-bold text-cream mb-4">{t("location")}</p>
          <p className="text-sm mb-3">{footer.address}</p>
          <p className="text-sm mb-3">WhatsApp: {footer.whatsappDisplay}</p>
          <p className="text-sm mb-3">Email: {footer.email}</p>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              className="aspect-video rounded-xl w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="aspect-video rounded-xl bg-cream/10 flex items-center justify-center text-xs text-cream/50">
              {t("mapLocation")}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {footer.copyrightText || `Optik Kayumanis. ${t("allRightsReserved")}`}
      </div>
    </footer>
  );
}
