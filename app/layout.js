import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Script from "next/script";
import { api } from "../lib/api";
import { DEFAULT_CONTENT } from "../lib/defaultContent";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
              <Navbar content={content} />
              <main className="flex-1">{children}</main>
              <Footer content={content} />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        {/* Midtrans Snap.js — needed on checkout page to open the payment popup */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
