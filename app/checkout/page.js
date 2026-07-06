"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api, formatRupiah } from "../../lib/api";

const SHIPPING_COST = 20000;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    recipientName: user?.name || "",
    phone: "",
    shippingAddress: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handlePhoneChange(e) {
    // Buang semua karakter selain angka, apa pun yang diketik/di-paste
    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
    setForm((f) => ({ ...f, phone: digitsOnly }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    if (items.length === 0) {
      setError("Keranjang kamu kosong.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        ...form,
      };
      const data = await api.post("/orders/checkout", payload, token);

      // Open Midtrans Snap payment popup
      if (window.snap && data.snapToken) {
        window.snap.pay(data.snapToken, {
          onSuccess: () => {
            clearCart();
            router.push(
              `/account?order=${data.order.orderNumber}&status=success`,
            );
          },
          onPending: () => {
            clearCart();
            router.push(
              `/account?order=${data.order.orderNumber}&status=pending`,
            );
          },
          onError: () => setError("Pembayaran gagal, silakan coba lagi."),
          onClose: () =>
            setError("Kamu menutup jendela pembayaran sebelum selesai."),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  const total = subtotal + SHIPPING_COST;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-bark-700 mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-sm text-bark-500 mb-1">
              Nama Penerima
            </label>
            <input
              name="recipientName"
              value={form.recipientName}
              onChange={handleChange}
              required
              className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-bark-500 mb-1">Nomor HP</label>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.phone}
              onChange={handlePhoneChange}
              onKeyDown={(e) => {
                // Izinkan tombol kontrol (backspace, tab, arrow, dll), blokir huruf/simbol
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "ArrowLeft",
                  "ArrowRight",
                  "Home",
                  "End",
                ];
                if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
                  return;
                if (!/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
              placeholder="08xxxxxxxxxx"
              required
              className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-bark-500 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-bark-500 mb-1">Kota</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-bark-500 mb-1">
                Provinsi
              </label>
              <input
                name="province"
                value={form.province}
                onChange={handleChange}
                required
                className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-bark-500 mb-1">
                Kode Pos
              </label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cinnamon-500 text-white font-medium py-3 rounded-full hover:bg-cinnamon-600 transition-colors disabled:opacity-50">
            {submitting ? "Memproses..." : `Bayar ${formatRupiah(total)}`}
          </button>
        </form>

        <div className="bg-white border border-sand rounded-2xl p-6 h-fit">
          <h2 className="font-display text-lg text-bark-700 mb-4">Ringkasan</h2>
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm text-bark-500 mb-2">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-mono">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <hr className="border-sand my-3" />
          <div className="flex justify-between text-sm text-bark-500 mb-2">
            <span>Subtotal</span>
            <span className="font-mono">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-bark-500 mb-2">
            <span>Ongkos Kirim</span>
            <span className="font-mono">{formatRupiah(SHIPPING_COST)}</span>
          </div>
          <hr className="border-sand my-3" />
          <div className="flex justify-between font-medium text-bark-700">
            <span>Total</span>
            <span className="font-mono">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
