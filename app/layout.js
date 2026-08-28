import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import SiteChrome from "../components/SiteChrome";
import Script from "next/script";
import { api } from "../lib/api";
import { DEFAULT_CONTENT } from "../lib/defaultContent";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const revalidate = 60;

export const metadata = {
  title: "Optik Kayumanis — Kacamata & Lensa Kontak Premium",
  description:
    "Optik Kayumanis: kacamata optik, kacamata hitam, dan lensa kontak premium dengan layanan periksa mata profesional.",
};

async function getSiteContent() {
  try {
    const data = await api.get("/content");
    return data.content;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export default async function RootLayout({ children }) {
  const content = await getSiteContent();

  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans bg-cream text-charcoal antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <SiteChrome content={content}>{children}</SiteChrome>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        {/* Midtrans Snap.js — needed on checkout page to open the payment popup.
            Must match the backend's MIDTRANS_IS_PRODUCTION flag (utils/midtrans.js),
            otherwise a production Snap token gets opened with the sandbox script (or vice versa). */}
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
