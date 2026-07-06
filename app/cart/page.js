"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-bark-700 mb-3">Keranjang kamu masih kosong</h1>
        <p className="text-bark-500 mb-8">Yuk cari kacamata favoritmu dulu.</p>
        <Link href="/shop" className="bg-cinnamon-500 text-white px-6 py-3 rounded-full font-medium hover:bg-cinnamon-600">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-bark-700 mb-8">Keranjang Belanja</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white border border-sand rounded-2xl p-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base text-bark-700 mb-1">{item.name}</h3>
                <p className="font-mono text-sm text-cinnamon-600 mb-2">{formatRupiah(item.price)}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-sand rounded-full">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 text-bark-700 hover:text-cinnamon-500"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 text-bark-700 hover:text-cinnamon-500"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-bark-300 hover:text-cinnamon-500"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <p className="font-mono text-sm text-bark-700 self-start">
                {formatRupiah(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-sand rounded-2xl p-6 h-fit">
          <h2 className="font-display text-lg text-bark-700 mb-4">Ringkasan Pesanan</h2>
          <div className="flex justify-between text-sm text-bark-500 mb-2">
            <span>Subtotal</span>
            <span className="font-mono">{formatRupiah(subtotal)}</span>
          </div>
          <p className="text-xs text-bark-300 mb-4">Ongkos kirim dihitung saat checkout.</p>
          <Link
            href="/checkout"
            className="block text-center bg-cinnamon-500 text-white font-medium py-3 rounded-full hover:bg-cinnamon-600 transition-colors"
          >
            Lanjut ke Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
