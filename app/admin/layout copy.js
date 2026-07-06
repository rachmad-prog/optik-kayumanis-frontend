"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/users", label: "Kelola User" },
  { href: "/admin/content", label: "Konten Halaman" },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login?next=/admin");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="font-display text-lg text-bark-700 mb-4">Admin Panel</p>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-xl text-sm font-medium ${
              pathname === link.href
                ? "bg-cinnamon-500 text-white"
                : "text-bark-500 hover:bg-sand"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
