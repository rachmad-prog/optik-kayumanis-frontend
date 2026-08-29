"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { api, formatRupiah } from "../../../lib/api";
import { PrinterProvider } from "../../../context/PrinterContext";
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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200";

function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -top-10 right-0 text-white/90 hover:text-white text-2xl leading-none"
        >
          ✕
        </button>
        <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl">
          <Image src={image.url} alt={image.name} fill className="object-contain" sizes="512px" />
        </div>
        <p className="text-center text-white/90 text-sm mt-3">{image.name}</p>
      </div>
    </div>
  );
}

function InvoiceStatusBadge({ order }) {
  if (order.invoiceEmailSent) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
        ✅ Invoice terkirim
      </span>
    );
  }
  if (order.invoiceEmailError) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full max-w-[220px] truncate"
        title={order.invoiceEmailError}
      >
        ⚠️ Gagal kirim: {order.invoiceEmailError}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-bark-300 bg-sand/40 px-2 py-1 rounded-full">
      ⏳ Belum terkirim
    </span>
  );
}

export default function AdminOrdersPage() {
  return (
    <PrinterProvider>
      <AdminOrdersPageInner />
    </PrinterProvider>
  );
}

function AdminOrdersPageInner() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [resendingId, setResendingId] = useState(null);

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

  async function handleResendInvoice(id) {
    setResendingId(id);
    try {
      const res = await api.post(`/orders/admin/${id}/resend-invoice`, {}, token);
      alert(res.message || "Invoice berhasil dikirim ulang.");
    } catch (err) {
      alert(err.message);
    } finally {
      setResendingId(null);
      loadOrders();
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
                  <p className="text-xs text-bark-300">
                    {order.user
                      ? `${order.user.name} — ${order.user.email}`
                      : `Tanpa akun (guest) — ${order.guestEmail || "-"}`}
                  </p>
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
              <div className="flex items-center gap-2 mb-3">
                <InvoiceStatusBadge order={order} />
                {!order.invoiceEmailSent && (
                  <button
                    type="button"
                    onClick={() => handleResendInvoice(order.id)}
                    disabled={resendingId === order.id}
                    className="text-xs font-medium text-cinnamon-600 hover:text-cinnamon-700 underline disabled:opacity-50"
                  >
                    {resendingId === order.id ? "Mengirim..." : "Kirim Ulang Invoice"}
                  </button>
                )}
              </div>
              <ul className="text-sm text-bark-500 mb-2 space-y-2">
                {order.items.map((item) => {
                  const imageUrl = item.product?.images?.[0]?.url || FALLBACK_IMAGE;
                  return (
                    <li key={item.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ url: imageUrl, name: item.name })}
                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-sand/40 shrink-0 cursor-zoom-in ring-1 ring-transparent hover:ring-cinnamon-300 transition"
                        title="Lihat gambar produk"
                      >
                        <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                      </button>
                      <span>{item.name} × {item.quantity}</span>
                    </li>
                  );
                })}
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
      <ImageLightbox image={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}

