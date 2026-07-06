"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function AddToCartForm({ product }) {
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const outOfStock = product.stock <= 0;

  function requireLogin() {
    setShowLoginNotice(true);
  }

  function handleAdd() {
    if (!user) return requireLogin();
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!user) return requireLogin();
    addItem(product, quantity);
    router.push("/cart");
  }

  // Admin tidak berbelanja — sembunyikan seluruh kontrol keranjang/pembelian.
  if (user?.role === "ADMIN") {
    return (
      <p className="text-sm text-bark-300 italic">
        Mode admin — fitur keranjang dan pembelian dinonaktifkan untuk akun ini.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="quantity" className="text-sm text-bark-500">
          Jumlah
        </label>
        <div className="flex items-center border border-sand rounded-full">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-bark-700 hover:text-cinnamon-500"
            aria-label="Kurangi jumlah">
            −
          </button>
          <span id="quantity" className="w-8 text-center font-mono">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-bark-700 hover:text-cinnamon-500"
            aria-label="Tambah jumlah">
            +
          </button>
        </div>
      </div>

      {showLoginNotice && !user && (
        <div className="mb-4 rounded-xl border border-cinnamon-300 bg-cinnamon-50 px-4 py-3 text-sm text-bark-700">
          Silakan{" "}
          <Link
            href="/login"
            className="font-medium text-cinnamon-600 underline hover:text-cinnamon-700">
            masuk
          </Link>{" "}
          terlebih dahulu untuk menambahkan produk ke keranjang.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock || loading}
          className="flex-1 border-2 border-cinnamon-500 text-cinnamon-600 font-medium py-3 rounded-full hover:bg-cinnamon-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {added ? "Ditambahkan ✓" : "Tambah ke Keranjang"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock || loading}
          className="flex-1 bg-cinnamon-500 text-white font-medium py-3 rounded-full hover:bg-cinnamon-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {outOfStock ? "Stok Habis" : "Beli Sekarang"}
        </button>
      </div>
    </div>
  );
}
