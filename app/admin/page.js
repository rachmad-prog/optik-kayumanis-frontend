"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api, formatRupiah } from "../../lib/api";
import LicenseModal from "../../components/LicenseModal";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // State untuk Modal Lisensi
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk Modal Edit Stok
  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [stockError, setStockError] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoadingStats(true);
      api
        .get("/admin/stats", token)
        .then((data) => setStats(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingStats(false));
    }
  }, [token]);

  const openEditStock = (product) => {
    setEditingStockProduct(product);
    setStockInput(String(product.stock));
    setStockError("");
  };

  const closeEditStock = () => {
    setEditingStockProduct(null);
    setStockInput("");
    setStockError("");
  };

  const handleSaveStock = async () => {
    const newStock = parseInt(stockInput, 10);
    if (isNaN(newStock) || newStock < 0) {
      setStockError("Masukkan jumlah stok yang valid (angka >= 0).");
      return;
    }
    setStockLoading(true);
    setStockError("");

    try {
      await api.put(
        `/products/${editingStockProduct.id}`,
        { stock: newStock },
        token,
      );

      setStats((prev) => {
        if (!prev) return prev;
        const updatedLowStock = prev.lowStock
          .map((p) =>
            p.id === editingStockProduct.id ? { ...p, stock: newStock } : p,
          )
          .filter((p) => p.stock <= 5);
        return { ...prev, lowStock: updatedLowStock };
      });

      closeEditStock();
    } catch (err) {
      setStockError(err.message || "Gagal memperbarui stok.");
    } finally {
      setStockLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kpis = [
    {
      label: "Total Produk",
      value: stats ? stats.totalProducts : 0,
      desc: "Produk di katalog",
      href: "/admin/products",
      bgGradient: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-200/60",
      textColor: "text-amber-600",
      iconBg: "bg-amber-100 text-amber-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      label: "Total Pesanan",
      value: stats ? stats.totalOrders : 0,
      desc: "Transaksi dibuat",
      href: "/admin/orders",
      bgGradient: "from-emerald-500/10 to-teal-500/5",
      borderColor: "border-emerald-200/60",
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
    },
    {
      label: "Total Pelanggan",
      value: stats ? stats.totalUsers : 0,
      desc: "Akun terdaftar",
      href: "/admin/users",
      bgGradient: "from-sky-500/10 to-blue-500/5",
      borderColor: "border-sky-200/60",
      textColor: "text-sky-600",
      iconBg: "bg-sky-100 text-sky-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Total Pendapatan",
      value: stats ? formatRupiah(stats.totalRevenue) : "Rp 0",
      desc: "Akumulasi omzet",
      href: "/admin/orders",
      bgGradient: "from-cinnamon-500/15 to-orange-600/5",
      borderColor: "border-cinnamon-300/60",
      textColor: "text-cinnamon-600",
      iconBg: "bg-cinnamon-100 text-cinnamon-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner Header ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-obsidian via-obsidian-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cinnamon/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest rounded-full backdrop-blur-sm">
                {currentDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Halo, {user?.name?.split(" ")[0] || "Admin"} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Selamat datang di Panel Manajemen Optik Kayumanis. Pantau pesanan, ketersediaan stok, dan publikasi konten toko secara realtime.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/products"
              className="px-4 py-2.5 rounded-2xl bg-cinnamon text-white font-bold text-xs uppercase tracking-wider hover:bg-cinnamon-600 transition shadow-lg shadow-cinnamon/30 flex items-center gap-2"
            >
              <span>+</span> Tambah Produk
            </Link>
            <Link
              href="/admin/articles/new"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm transition flex items-center gap-2 border border-white/10"
            >
              <span>✍️</span> Tulis Artikel
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ────────────────────────────────────────────────── */}
      {loadingStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kpis.map((kpi) => (
            <Link
              key={kpi.label}
              href={kpi.href}
              className={`group bg-white rounded-3xl p-6 border ${kpi.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${kpi.bgGradient}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  {kpi.icon}
                </div>
              </div>
              <div>
                <p className={`font-extrabold text-2xl sm:text-3xl tracking-tight leading-none mb-2 ${kpi.textColor}`}>
                  {kpi.value}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{kpi.desc}</span>
                  <span className="text-slate-600 group-hover:translate-x-1 transition-transform font-bold">
                    Detail &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Quick Shortcut Cards ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
          Akses Cepat Pengelolaan
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-100 transition duration-200 text-left group"
          >
            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👓</span>
            <p className="text-xs font-bold text-charcoal group-hover:text-cinnamon">Katalog Produk</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Kelola frame &amp; lensa</p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition duration-200 text-left group"
          >
            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🛍️</span>
            <p className="text-xs font-bold text-charcoal group-hover:text-emerald-600">Pesanan Masuk</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Cek pembayaran &amp; kirim</p>
          </Link>

          <Link
            href="/admin/content"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:border-orange-200 border border-slate-100 transition duration-200 text-left group"
          >
            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🖼️</span>
            <p className="text-xs font-bold text-charcoal group-hover:text-cinnamon">Banner &amp; Konten</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Slider store &amp; kontak</p>
          </Link>

          <Link
            href="/admin/articles"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition duration-200 text-left group"
          >
            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📰</span>
            <p className="text-xs font-bold text-charcoal group-hover:text-sky-600">Artikel Blog</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Edukasi &amp; tips optik</p>
          </Link>
        </div>
      </div>

      {/* ── Main Data Grids (Pesanan Terbaru & Stok Menipis) ────────────────── */}
      {stats && (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* 1. Pesanan Terbaru */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  📦
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-charcoal">Pesanan Terbaru</h2>
                  <p className="text-[11px] text-slate-400">Transaksi terbaru dari pembeli</p>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-cinnamon hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between hover:bg-slate-100 transition"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-charcoal">{o.orderNumber}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{o.user?.name || "Customer"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">{formatRupiah(o.total)}</p>
                      <span className="inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 mt-0.5">
                        {o.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <span className="text-4xl block mb-2">🛒</span>
                <p className="text-sm font-bold text-charcoal">Belum Ada Pesanan</p>
                <p className="text-xs text-slate-400 mt-1">Pesanan yang masuk dari pengunjung akan otomatis muncul di sini.</p>
              </div>
            )}
          </div>

          {/* 2. Peringatan Stok Menipis */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  ⚠️
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-charcoal">Peringatan Stok Menipis</h2>
                  <p className="text-[11px] text-slate-400">Produk dengan stok &le; 5 unit</p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                {stats.lowStock?.length || 0} Perhatian
              </span>
            </div>

            {stats.lowStock && stats.lowStock.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStock.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between hover:bg-amber-50 transition"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-bold text-charcoal truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Kategori: {p.category?.name || "Eyewear"}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-600 font-mono">
                        {p.stock} tersisa
                      </span>
                      <button
                        onClick={() => openEditStock(p)}
                        title="Edit stok"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-cinnamon hover:text-white hover:border-cinnamon transition-all text-xs font-bold shadow-sm"
                      >
                        Ubah Stok
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <span className="text-4xl block mb-2">✅</span>
                <p className="text-sm font-bold text-emerald-600">Semua Stok Produk Aman</p>
                <p className="text-xs text-slate-400 mt-1">Tidak ada produk yang berada di bawah batas minimum stok.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Lisensi Direktur ────────────────────────────────────────── */}
      <LicenseModal
        open={isModalOpen && user?.role === "DIREKTUR"}
        onClose={() => setIsModalOpen(false)}
        token={token}
        onSuccess={() => window.location.reload()}
      />

      {/* ── Modal Edit Stok Cepat ─────────────────────────────────────────── */}
      {editingStockProduct && (
        <div className="fixed inset-0 bg-obsidian/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 text-charcoal">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-obsidian">
                Update Stok Produk
              </h3>
              <button
                onClick={closeEditStock}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-charcoal flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl mb-5">
              <p className="text-xs font-bold text-charcoal">{editingStockProduct.name}</p>
              <p className="text-[11px] text-slate-400">Stok sekarang: <span className="font-bold text-red-500">{editingStockProduct.stock} unit</span></p>
            </div>

            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
              Jumlah Stok Baru
            </label>
            <input
              type="number"
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl mb-2 text-sm font-bold focus:outline-none focus:border-cinnamon focus:ring-2 focus:ring-cinnamon/20 bg-white text-charcoal transition"
              disabled={stockLoading}
              autoFocus
            />

            {stockError && (
              <p className="text-xs font-medium text-red-600 mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
                ⚠️ {stockError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditStock}
                className="px-5 py-2.5 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-100 transition"
                disabled={stockLoading}
              >
                Batal
              </button>
              <button
                onClick={handleSaveStock}
                className="px-6 py-2.5 bg-cinnamon text-white rounded-2xl text-xs font-bold hover:bg-cinnamon-600 transition shadow-lg shadow-cinnamon/25 disabled:opacity-50"
                disabled={stockLoading || stockInput === ""}
              >
                {stockLoading ? "Menyimpan..." : "Simpan Stok"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
