"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import FrameShapeFilter from "./FrameShapeFilter";
import FaceShapeQuizModal from "./FaceShapeQuizModal";

export default function ShopCatalogContainer({ initialProducts, categories, currentCategory, initialQuery }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedShape, setSelectedShape] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Client-side filtering logic for instant smooth responsiveness
  const filteredProducts = products.filter((p) => {
    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.name?.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }

    // Shape filter simulation
    if (selectedShape !== "all") {
      const pName = p.name?.toLowerCase() || "";
      const pDesc = p.description?.toLowerCase() || "";
      if (!pName.includes(selectedShape) && !pDesc.includes(selectedShape)) {
        // Fallback demo matching for shape
        return true;
      }
    }
    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div>
      {/* Quiz Modal */}
      <FaceShapeQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectRecommendation={(shapeSlug) => {
          setSelectedShape(shapeSlug);
        }}
      />

      {/* Hero Banner Halaman Store 2026 */}
      <div className="relative rounded-3xl overflow-hidden bg-obsidian text-white p-8 md:p-12 mb-10 shadow-2xl bg-mesh-dark border border-slate-800">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/20 text-champagne text-xs font-bold uppercase tracking-widest mb-4 border border-champagne/30">
            ✨ Collection 2026 • Eyewear & Eyecare
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Katalog Frame & Lensa <span className="text-champagne">Ultra Elegant</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            Temukan desain kacamata terkini berstandar presisi optik. Diproduksi dengan material Titanium ringan, TR90 fleksibel, dan lensa anti-radiasi terkini.
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-champagne-gold to-champagne hover:from-champagne hover:to-champagne-600 text-obsidian font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-champagne/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>✨ Bingung Pilih? Ikuti Quiz Bentuk Wajah</span>
            </button>
          </div>
        </div>

        {/* Decorative Glass Badge */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-72 p-5 glass-panel-dark rounded-2xl border border-white/10 shadow-glow text-slate-200 text-xs leading-relaxed">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-champagne/20 text-champagne font-bold flex items-center justify-center">
              ✓
            </div>
            <div>
              <p className="font-bold text-white">Garansi Optik Kayumanis</p>
              <p className="text-[11px] text-slate-400">100% Lensa Presisi & Original</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300">
            Setiap pembelian frame sudah termasuk pembersihan ultrasonik dan garansi penyetelan ulang gratis.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Chips & Sort */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-card-modern mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama kacamata, bahan, atau jenis lensa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-obsidian placeholder-slate-400 focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-obsidian"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Urutkan:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-obsidian focus:outline-none focus:border-champagne"
            >
              <option value="featured">Paling Populer (Trending)</option>
              <option value="price-low">Harga: Terendah ke Tertinggi</option>
              <option value="price-high">Harga: Tertinggi ke Terendah</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <a
            href="/shop"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !currentCategory
                ? "bg-obsidian text-white shadow-md shadow-obsidian/20 scale-102"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-obsidian"
            }`}
          >
            ✨ Semua Produk ({products.length})
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentCategory === cat.slug
                  ? "bg-obsidian text-white shadow-md shadow-obsidian/20 scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-obsidian"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        {/* Visual Frame Shape Filter */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <FrameShapeFilter
            selectedShape={selectedShape}
            onSelectShape={(shape) => setSelectedShape(shape)}
          />
        </div>
      </div>

      {/* Product Grid Results */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-card-modern my-10">
          <div className="w-16 h-16 bg-champagne-50 text-champagne rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="font-extrabold text-xl text-obsidian mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Maaf, kami tidak dapat menemukan kacamata dengan kata kunci &quot;{searchQuery}&quot;. Coba sesuaikan kata kunci pencarianmu.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedShape("all");
            }}
            className="px-6 py-2.5 bg-obsidian text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menampilkan <span className="text-obsidian">{sortedProducts.length}</span> Koleksi Kacamata
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {sortedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
