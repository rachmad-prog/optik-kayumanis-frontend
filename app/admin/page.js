"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api, formatRupiah } from "../../lib/api";
import LicenseModal from "../../components/LicenseModal";

export default function AdminDashboard() {
  // 1. Ambil data 'user' dariuseAuth() untuk mengecek role login
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);

  // State untuk Modal Lisensi (dipakai kalau /admin/stats gagal karena bukan admin/direktur yang sah,
  // meskipun secara normal ADMIN/DIREKTUR selalu lolos checkLicense di backend)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk Modal Edit Stok
  const [editingStockProduct, setEditingStockProduct] = useState(null); // { id, name, stock }
  const [stockInput, setStockInput] = useState("");
  const [stockError, setStockError] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api
        .get("/admin/stats", token)
        .then((data) => setStats(data))
        .catch((err) => console.error(err));
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

      // Perbarui data lokal tanpa perlu reload halaman
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

  const cards = stats
    ? [
        { label: "Total Produk", value: stats.totalProducts },
        { label: "Total Pesanan", value: stats.totalOrders },
        { label: "Total Pelanggan", value: stats.totalUsers },
        { label: "Total Pendapatan", value: formatRupiah(stats.totalRevenue) },
      ]
    : [];

  return (
    <div>
      {/* Header Dashboard & Tombol Lisensi (Hanya DIREKTUR yang bisa lihat tombol ini) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700">
          Dashboard
        </h1>

        {/* 🔥 GERBANG KONDISI: Tombol Lisensi disembunyikan total dari ADMIN */}
        {user?.role === "DIREKTUR" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 border border-sand bg-white text-bark-500 hover:text-cinnamon-600 rounded-xl text-xs font-medium shadow-sm transition-all flex items-center gap-1.5">
            🔑 Lisensi Sistem
          </button>
        )}
      </div>

      {/* Kondisi Konten Utama — peringatan lisensi habis sudah ditangani LicenseBanner di admin/layout.js */}
      {!stats ? (
        // Tampilan loading standar sebelum data ditarik
        <p className="text-bark-300 text-sm">Memuat statistik...</p>
      ) : (
        // Tampilan dashboard normal jika sukses ambil data dari backend
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {cards.map((c) => (
              <div
                key={c.label}
                className="bg-white border border-sand rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-bark-300 mb-1">
                  {c.label}
                </p>
                <p className="font-display text-2xl text-cinnamon-600">
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-sand rounded-2xl p-5">
              <h2 className="font-display text-lg text-bark-700 mb-3">
                Pesanan Terbaru
              </h2>
              <ul className="space-y-2 text-sm">
                {stats.recentOrders.map((o) => (
                  <li key={o.id} className="flex justify-between text-bark-500">
                    <span className="font-mono">{o.orderNumber}</span>
                    <span>{formatRupiah(o.total)}</span>
                  </li>
                ))}
                {stats.recentOrders.length === 0 && (
                  <p className="text-bark-300">Belum ada pesanan.</p>
                )}
              </ul>
            </div>

            <div className="bg-white border border-sand rounded-2xl p-5">
              <h2 className="font-display text-lg text-bark-700 mb-3">
                Stok Menipis
              </h2>
              <ul className="space-y-2 text-sm">
                {stats.lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="flex justify-between items-center text-bark-500">
                    <span>{p.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-cinnamon-600">
                        {p.stock} tersisa
                      </span>
                      <button
                        onClick={() => openEditStock(p)}
                        title="Edit stok"
                        aria-label={`Edit stok ${p.name}`}
                        className="p-1 rounded-lg text-bark-300 hover:text-cinnamon-600 hover:bg-sand/40 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                        </svg>
                      </button>
                    </span>
                  </li>
                ))}
                {stats.lowStock.length === 0 && (
                  <p className="text-bark-300">Stok semua produk aman.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* MODAL LISENSI (komponen bersama, sama dengan yang ada di admin/layout.js) */}
      <LicenseModal
        open={isModalOpen && user?.role === "DIREKTUR"}
        onClose={() => setIsModalOpen(false)}
        token={token}
        onSuccess={() => window.location.reload()}
      />

      {/* MODAL EDIT STOK */}
      {editingStockProduct && (
        <div className="fixed inset-0 bg-bark-700/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-sand text-bark-700">
            <h3 className="text-lg font-display font-semibold mb-1">
              Edit Stok Produk
            </h3>
            <p className="text-xs text-bark-300 mb-4">
              {editingStockProduct.name}
            </p>

            <label className="block text-xs font-medium text-bark-500 mb-1">
              Jumlah Stok
            </label>
            <input
              type="number"
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="w-full p-2.5 border border-sand rounded-xl mb-2 text-sm focus:outline-none focus:border-cinnamon-600 bg-sand/20 text-bark-600"
              disabled={stockLoading}
              autoFocus
            />

            {stockError && (
              <p className="text-xs font-medium text-red-600 mb-3 bg-red-50 p-2 rounded-xl">
                ⚠️ {stockError}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeEditStock}
                className="px-4 py-2 text-bark-500 rounded-xl text-sm font-medium hover:bg-sand/30 transition-colors"
                disabled={stockLoading}>
                Batal
              </button>
              <button
                onClick={handleSaveStock}
                className="px-4 py-2 bg-cinnamon-600 text-white rounded-xl text-sm font-medium hover:bg-cinnamon-700 transition-colors disabled:bg-cinnamon-300"
                disabled={stockLoading || stockInput === ""}>
                {stockLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
