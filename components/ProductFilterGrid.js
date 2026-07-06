"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductFilterGrid({ products, categories }) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category?.slug === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-sm font-semibold text-warmgray">Filter kategori:</span>
        <button
          onClick={() => setFilter("all")}
          className={`filter-btn ${filter === "all" ? "active" : ""} px-4 py-1.5 rounded-full border border-beige text-sm font-medium transition`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.slug)}
            className={`filter-btn ${filter === cat.slug ? "active" : ""} px-4 py-1.5 rounded-full border border-beige text-sm font-medium transition`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-warmgray text-sm py-10 text-center">
          Belum ada produk untuk kategori ini.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
