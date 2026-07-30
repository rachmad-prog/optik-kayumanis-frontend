"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

// The admin panel (app/admin/layout.js) has its own sidebar menu
// (Dashboard/Produk/Pesanan/Kelola User/Konten Halaman) — it shouldn't also
// show the storefront's Navbar (with its own mobile Home/About/.../Admin menu),
// Footer, or floating WhatsApp button on top of that.
export default function SiteChrome({ content, children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar content={content} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer content={content} />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}
