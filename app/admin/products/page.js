"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api, formatRupiah } from "../../../lib/api";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadProducts() {
    setLoading(true);
    setError(null);
    api
      .get("/products/admin/all", token)
      .then((data) => setProducts(data.items))
      .catch((err) => setError(err.message || "Gagal memuat produk."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await api.del(`/products/${id}`, token);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700">Kelola Produk</h1>
        <Link
          href="/admin/products/new"
          className="bg-cinnamon-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-cinnamon-600"
        >
          + Tambah Produk
        </Link>
      </div>

      {loading ? (
        <p className="text-bark-300 text-sm">Memuat produk...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="bg-white border border-sand rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand/60 text-bark-500 text-left">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-sand">
                  <td className="px-4 py-3 text-bark-700 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-bark-500">{p.category?.name}</td>
                  <td className="px-4 py-3 font-mono text-cinnamon-600">{formatRupiah(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-cinnamon-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-bark-300">
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
