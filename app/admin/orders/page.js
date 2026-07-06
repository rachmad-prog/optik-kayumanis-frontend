"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api, formatRupiah } from "../../../lib/api";
import PrintReceiptButton from "../../../components/PrintReceiptButton";

const STATUS_OPTIONS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "EXPIRED"];

const STATUS_LABEL = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    api.get("/orders/admin/all", token).then((data) => setOrders(data.items)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  async function handleStatusChange(id, status) {
    try {
      await api.patch(`/orders/admin/${id}/status`, { status }, token);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-bark-700 mb-6">Kelola Pesanan</h1>

      {loading ? (
        <p className="text-bark-300 text-sm">Memuat pesanan...</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-sand rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-sm text-bark-700">{order.orderNumber}</p>
                  <p className="text-xs text-bark-300">{order.user?.name} — {order.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PrintReceiptButton order={order} />
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-sand rounded-full px-3 py-1.5 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="text-sm text-bark-500 mb-2">
                {order.items.map((item) => (
                  <li key={item.id}>{item.name} × {item.quantity}</li>
                ))}
              </ul>
              <p className="text-xs text-bark-300 mb-1">
                Kirim ke: {order.recipientName}, {order.shippingAddress}, {order.city}, {order.province} {order.postalCode}
              </p>
              <p className="font-mono text-sm font-semibold text-bark-700">Total: {formatRupiah(order.total)}</p>
            </div>
          ))}
          {orders.length === 0 && <p className="text-bark-300 text-sm">Belum ada pesanan.</p>}
        </div>
      )}
    </div>
  );
}
