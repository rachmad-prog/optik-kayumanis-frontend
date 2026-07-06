"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api, formatRupiah } from "../../lib/api";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (token) api.get("/admin/stats", token).then(setStats).catch(() => {});
  }, [token]);

  if (!stats) return <p className="text-bark-300 text-sm">Memuat statistik...</p>;

  const cards = [
    { label: "Total Produk", value: stats.totalProducts },
    { label: "Total Pesanan", value: stats.totalOrders },
    { label: "Total Pelanggan", value: stats.totalUsers },
    { label: "Total Pendapatan", value: formatRupiah(stats.totalRevenue) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-bark-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-sand rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-bark-300 mb-1">{c.label}</p>
            <p className="font-display text-2xl text-cinnamon-600">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-sand rounded-2xl p-5">
          <h2 className="font-display text-lg text-bark-700 mb-3">Pesanan Terbaru</h2>
          <ul className="space-y-2 text-sm">
            {stats.recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between text-bark-500">
                <span className="font-mono">{o.orderNumber}</span>
                <span>{formatRupiah(o.total)}</span>
              </li>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-bark-300">Belum ada pesanan.</p>}
          </ul>
        </div>

        <div className="bg-white border border-sand rounded-2xl p-5">
          <h2 className="font-display text-lg text-bark-700 mb-3">Stok Menipis</h2>
          <ul className="space-y-2 text-sm">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex justify-between text-bark-500">
                <span>{p.name}</span>
                <span className="font-mono text-cinnamon-600">{p.stock} tersisa</span>
              </li>
            ))}
            {stats.lowStock.length === 0 && <p className="text-bark-300">Stok semua produk aman.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
