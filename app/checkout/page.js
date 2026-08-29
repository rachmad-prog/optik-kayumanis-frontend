"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api, formatRupiah } from "../../lib/api";
import { DEFAULT_CONTENT } from "../../lib/defaultContent";

const SHIPPING_COST = 20000;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    recipientName: user?.name || "",
    email: user?.email || "",
    phone: "",
    shippingAddress: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [bankAccounts, setBankAccounts] = useState(DEFAULT_CONTENT.bankAccounts);
  const [selectedBank, setSelectedBank] = useState(DEFAULT_CONTENT.bankAccounts[0] || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    // Kalau customer sedang login, auto-isi nama & email dari akunnya.
    if (user) {
      setForm((f) => ({
        ...f,
        recipientName: f.recipientName || user.name || "",
        email: f.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/content")
      .then((data) => {
        if (data?.content?.bankAccounts?.length) {
          setBankAccounts(data.content.bankAccounts);
          setSelectedBank(data.content.bankAccounts[0]);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
    setForm((f) => ({ ...f, phone: digitsOnly }));
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

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
        bankName: selectedBank ? `${selectedBank.bankName} (${selectedBank.accountNumber})` : "Transfer Bank",
      };

      const data = await api.post("/orders/checkout", payload, token);
      clearCart();
      setCompletedOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  const total = subtotal + SHIPPING_COST;

  // Render Bank Transfer Confirmation Modal / Receipt when order succeeds
  if (completedOrder) {
    const waText = encodeURIComponent(
      `Halo Optik Kayumanis, saya sudah transfer untuk pesanan baru!\n\n` +
      `No. Pesanan: ${completedOrder.orderNumber}\n` +
      `Nama: ${completedOrder.recipientName}\n` +
      `Total Pembayaran: ${formatRupiah(completedOrder.total)}\n` +
      `Transfer ke: ${selectedBank?.bankName || "Bank"} (${selectedBank?.accountNumber || ""})\n\n` +
      `Mohon verifikasi pesanan saya. Terima kasih!`
    );
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;

    return (
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 animate-fadeIn">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <span className="inline-block px-3 py-1 bg-champagne-100 text-champagne-700 text-xs font-extrabold uppercase tracking-widest rounded-full mb-2">
            Pesanan Berhasil Dibuat
          </span>
          <h1 className="text-3xl font-extrabold text-obsidian tracking-tight mb-2">
            Instruksi Pembayaran Transfer Bank
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Terima kasih telah berbelanja di Optik Kayumanis! Silakan selesaikan transfer ke rekening berikut:
          </p>

          {/* Bank Card Info */}
          {selectedBank && (
            <div className="bg-obsidian text-white rounded-2xl p-6 mb-8 text-left border border-slate-800 shadow-xl max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-champagne">
                  {selectedBank.bankName}
                </span>
                <span className="text-xs text-slate-400">Atas Nama: {selectedBank.accountName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nomor Rekening</p>
                  <p className="text-2xl font-mono font-bold tracking-widest text-white mt-0.5">
                    {selectedBank.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedBank.accountNumber)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-champagne hover:text-obsidian text-xs font-bold text-slate-200 transition"
                >
                  {copiedBank ? "✓ Tersalin!" : "Salin No. Rek"}
                </button>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Nomor Pesanan:</span>
              <span className="font-extrabold text-obsidian">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Yang Harus Ditransfer:</span>
              <span className="font-extrabold text-champagne-600 text-sm">
                {formatRupiah(completedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Penerima:</span>
              <span className="font-bold text-obsidian">{completedOrder.recipientName}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬 Konfirmasi / Kirim Bukti via WhatsApp</span>
            </a>
            {user ? (
              <button
                onClick={() => router.push("/account")}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-obsidian rounded-2xl font-bold text-xs uppercase tracking-wider transition"
              >
                Lihat Status Pesanan
              </button>
            ) : (
              <button
                onClick={() => router.push("/track-order")}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-obsidian rounded-2xl font-bold text-xs uppercase tracking-wider transition"
              >
                Lacak Status Pesanan
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs uppercase font-extrabold tracking-widest text-champagne-600 bg-champagne-50 px-3 py-1 rounded-full inline-block mb-2">
          Secure Checkout 2026
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-obsidian tracking-tight">
          Pengiriman & Pembayaran Bank Transfer
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card-modern space-y-5">
            <h2 className="text-lg font-extrabold text-obsidian border-b border-slate-100 pb-3">
              1. Alamat Pengiriman
            </h2>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                Nama Penerima
              </label>
              <input
                name="recipientName"
                value={form.recipientName}
                onChange={handleChange}
                required
                placeholder="Masukkan nama penerima"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="nama@email.com"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Dipakai untuk mengirim invoice & konfirmasi pesanan.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                Nomor WhatsApp / HP
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="08xxxxxxxxxx"
                required
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                Alamat Lengkap
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                  Kota
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Kota/Kab"
                  className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-xs text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                  Provinsi
                </label>
                <input
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  required
                  placeholder="Provinsi"
                  className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-xs text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-1.5">
                  Kode Pos
                </label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="16xxx"
                  className="w-full border border-slate-200 rounded-2xl px-3 py-3 text-xs text-obsidian focus:border-champagne focus:outline-none bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Bank Transfer Selection */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card-modern">
            <h2 className="text-lg font-extrabold text-obsidian border-b border-slate-100 pb-3 mb-4">
              2. Pilih Rekening Bank Tujuan Transfer
            </h2>

            <div className="space-y-3">
              {bankAccounts.map((bank, i) => {
                const isSelected = selectedBank?.bankName === bank.bankName;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedBank(bank)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? "border-champagne bg-champagne-50/50 ring-2 ring-champagne/40"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-obsidian">{bank.bankName}</p>
                      <p className="text-xs text-slate-500">
                        No. Rek: <span className="font-mono font-bold text-obsidian">{bank.accountNumber}</span> (a/n {bank.accountName})
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-champagne bg-champagne text-obsidian" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-obsidian text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl hover:bg-champagne hover:text-obsidian transition-all shadow-xl shadow-obsidian/20 disabled:opacity-50"
          >
            {submitting ? "Memproses Pesanan..." : `Buat Pesanan & Dapatkan Rekening (${formatRupiah(total)})`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card-modern h-fit">
          <h2 className="font-extrabold text-base text-obsidian mb-4 border-b border-slate-100 pb-3">
            Ringkasan Pesanan
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-xs text-slate-600">
                <span className="font-medium line-clamp-1 flex-1 pr-2">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono font-bold text-obsidian">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 my-4 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-obsidian">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Ongkos Kirim</span>
              <span className="font-mono font-bold text-obsidian">{formatRupiah(SHIPPING_COST)}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between font-extrabold text-obsidian text-base">
            <span>Total Bayar</span>
            <span className="text-champagne-600">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
