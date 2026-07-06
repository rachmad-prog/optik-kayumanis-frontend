"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
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

export default function AccountPage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/account");
      return;
    }
    if (user) {
      api
        .get("/orders/me", token)
        .then((data) => setOrders(data.items))
        .finally(() => setLoadingOrders(false));
    }
  }, [user, loading, token, router]);

  if (loading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bark-700">Halo, {user.name}</h1>
          <p className="text-bark-500 text-sm">{user.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-bark-300 hover:text-cinnamon-500">
          Keluar
        </button>
      </div>

      <h2 className="font-display text-xl text-bark-700 mb-4">Riwayat Pesanan</h2>

      {loadingOrders ? (
        <p className="text-bark-300 text-sm">Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <p className="text-bark-300 text-sm">Kamu belum memiliki pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-sand rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
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
              <p className="font-mono text-sm font-semibold text-bark-700">
                Total: {formatRupiah(order.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
