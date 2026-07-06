"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api"; // Ganti dengan path folder lib/api lo jika berbeda

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/users", label: "Kelola User" },
  { href: "/admin/content", label: "Konten Halaman" },
];

export default function AdminLayout({ children }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // State untuk modal lisensi direktur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 🔑 IZINKAN ADMIN DAN DIREKTUR MASUK
    if (!loading) {
      if (!user || (user.role !== "ADMIN" && user.role !== "DIREKTUR")) {
        router.push("/login?next=/admin");
      }
    }
  }, [user, loading, router]);

  // Handler Aktivasi Lisensi oleh Direktur
  const handleActivateLicense = async () => {
    setBtnLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post(
        "/license/activate",
        {
          inputToken: tokenInput,
          customExpiredAt: durationInput,
        },
        token,
      ); // Mengirimkan Bearer token login direktur

      alert(res.message || "Lisensi sistem berhasil diperbarui!");
      setIsModalOpen(false);
      setTokenInput("");
      setDurationInput("");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memperbarui lisensi.",
      );
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || !user || (user.role !== "ADMIN" && user.role !== "DIREKTUR"))
    return null;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="font-display text-lg text-bark-700 mb-4">Admin Panel</p>

        {/* Menu Navigasi Utama */}
        <div className="space-y-1 mb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-xl text-sm font-medium ${
                pathname === link.href
                  ? "bg-cinnamon-500 text-white"
                  : "text-bark-500 hover:bg-sand"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* 🔑 TOMBOL LISENSI DAN TOKEN (HANYA MUNCUL DI SIDEBAR JIKA ROLE = DIREKTUR) */}
        {user.role === "DIREKTUR" && (
          <div className="pt-4 border-t border-sand">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-4 py-2.5 bg-cinnamon-600 hover:bg-cinnamon-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2">
              <span>🔑</span> Lisensi & Token JWT
            </button>
          </div>
        )}
      </aside>

      <div>{children}</div>

      {/* ================= MODAL LISENSI KHUSUS DIREKTUR ================= */}
      {isModalOpen && user.role === "DIREKTUR" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-sand text-bark-700">
            <h3 className="text-lg font-display font-semibold mb-1 text-bark-700">
              Aktivasi Lisensi Website
            </h3>
            <p className="text-xs text-bark-400 mb-4">
              Panel khusus Direktur untuk memantau token otentikasi dan
              memperpanjang masa aktif web.
            </p>

            {/* PANEL INFO TOKEN AKTIF */}
            <div className="mb-4 bg-gray-50 border border-sand p-3 rounded-xl">
              <label className="block text-[10px] uppercase font-bold tracking-wide text-bark-500 mb-1">
                🔑 Token JWT Aktif Direktur:
              </label>
              <div
                className="bg-white border border-sand/60 p-2 rounded-lg font-mono text-[10px] text-bark-600 break-all max-h-20 overflow-y-auto select-all cursor-pointer"
                title="Klik untuk menyalin">
                {token}
              </div>
            </div>

            {/* INPUT SECURITY TOKEN */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-bark-600 mb-1">
                Masukkan Website Token (.env):
              </label>
              <input
                type="text"
                placeholder="Masukkan token keamanan..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full p-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:border-cinnamon-600 bg-sand/20 font-mono text-xs text-bark-700"
                disabled={btnLoading}
              />
            </div>

            {/* INPUT PILIHAN TANGGAL KEDALUWARSA */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-bark-600 mb-1">
                Batas Waktu Aktif Website Baru:
              </label>
              <input
                type="datetime-local"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                className="w-full p-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:border-cinnamon-600 bg-sand/20 text-bark-700"
                disabled={btnLoading}
              />
            </div>

            {errorMessage && (
              <p className="text-xs font-medium text-red-600 mb-3 bg-red-50 p-2 rounded-xl">
                ⚠️ {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setErrorMessage("");
                }}
                className="px-4 py-2 text-bark-500 rounded-xl text-sm font-medium hover:bg-sand/30 transition-colors"
                disabled={btnLoading}>
                Batal
              </button>
              <button
                onClick={handleActivateLicense}
                className="px-4 py-2 bg-cinnamon-600 text-white rounded-xl text-sm font-medium hover:bg-cinnamon-700 transition-colors disabled:bg-cinnamon-300"
                disabled={btnLoading || !tokenInput.trim() || !durationInput}>
                {btnLoading ? "Memproses..." : "Perbarui Lisensi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
