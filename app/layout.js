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
  icons: {
    icon: "https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png",
    shortcut: "https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png",
    apple: "https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png",
  },
};

async function getSiteContent() {
  try {
    const data = await api.get("/content");
    return data.content;
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function getTracking() {
  try {
    const data = await api.get("/tracking");
    return data.tracking || {};
  } catch {
    return {};
  }
}

export default async function RootLayout({ children }) {
  const content = await getSiteContent();
  const tracking = await getTracking();

  const { metaPixelId, googleAdsId, googleAdsLabel, gtmId, gaId } = tracking;

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

        {/* Midtrans Snap.js — needed on checkout page to open the payment popup. */}
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />

        {/* ── Google Tag Manager ────────────────────────────────────────────── */}
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

        {/* ── Google Analytics 4 ────────────────────────────────────────────── */}
        {gaId && !gtmId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}

        {/* ── Google Ads ────────────────────────────────────────────────────── */}
        {googleAdsId && !gtmId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');${googleAdsLabel ? `
gtag('event', 'conversion', {'send_to': '${googleAdsId}/${googleAdsLabel}'});` : ""}`}
            </Script>
          </>
        )}

        {/* ── Meta (Facebook) Pixel ─────────────────────────────────────────── */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
