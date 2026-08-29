"use client";

import { useState } from "react";
import { api, formatRupiah } from "../../lib/api";

const STATUS_LABEL = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
};

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNumber: "", email: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({
        orderNumber: form.orderNumber.trim(),
        email: form.email.trim(),
      });
      const data = await api.get(`/orders/track?${params.toString()}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Pesanan tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-bark-700 mb-2">Lacak Pesanan</h1>
        <p className="text-bark-500 text-sm">
          Sudah checkout tanpa akun? Masukkan nomor pesanan dan email yang kamu gunakan saat checkout
          untuk melihat status pesananmu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-sand rounded-2xl p-6 space-y-4 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-bark-500 mb-1.5">
            Nomor Pesanan
          </label>
          <input
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            required
            placeholder="OK-XXXXXXXXXXXXXX-XXX"
            className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-bark-700 focus:border-cinnamon-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-bark-500 mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email saat checkout"
            className="w-full border border-sand rounded-xl px-4 py-3 text-sm text-bark-700 focus:border-cinnamon-400 focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cinnamon-500 hover:bg-cinnamon-600 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? "Mencari..." : "Lacak Pesanan"}
        </button>
      </form>

      {order && (
        <div className="bg-white border border-sand rounded-2xl p-5">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
            <div>
              <p className="font-mono text-sm text-bark-700">{order.orderNumber}</p>
              <p className="text-xs text-bark-300">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-cinnamon-50 text-cinnamon-600">
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>

          <ul className="text-sm text-bark-500 mb-3">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <div className="border-t border-sand pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-bark-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-bark-500">
              <span>Ongkos Kirim</span>
              <span className="font-mono">{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-bark-700 pt-1">
              <span>Total</span>
              <span className="font-mono">{formatRupiah(order.total)}</span>
            </div>
          </div>

          <div className="border-t border-sand mt-3 pt-3 text-xs text-bark-500 space-y-1">
            <p>Dikirim ke: {order.recipientName}</p>
            <p>{order.shippingAddress}, {order.city}, {order.province} {order.postalCode}</p>
          </div>
        </div>
      )}

      {!order && searched && !loading && !error && (
        <p className="text-bark-300 text-sm text-center">Tidak ada pesanan ditemukan.</p>
      )}
    </div>
  );
}
