import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "../lib/api";

export default function ProductCard({ product }) {
  const image =
    product.images?.[0]?.url || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800";
  const discounted = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative block bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-obsidian/10 transition-all duration-500 transform hover:-translate-y-1"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discounted && (
            <span className="bg-obsidian text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
              Promo
            </span>
          )}
          {product.isFeatured && !discounted && (
            <span className="bg-gradient-to-r from-champagne-gold to-champagne text-obsidian text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              Trending 2026
            </span>
          )}
        </div>

        {/* Color Swatch Preview Dots */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white shadow-xs" title="Black Frame" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700 border border-white shadow-xs" title="Tortoise / Brown" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white shadow-xs" title="Silver Titanium" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-champagne-600">
            {product.category?.name || "Eyewear"}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
            TR90 / Titanium
          </span>
        </div>

        <h3 className="font-bold text-base text-obsidian leading-snug mb-2 group-hover:text-champagne-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-obsidian font-extrabold text-base tracking-tight">
              {formatRupiah(product.price)}
            </span>
            {discounted && (
              <span className="text-xs text-slate-400 line-through">
                {formatRupiah(product.compareAtPrice)}
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-champagne-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Detail ➔
          </span>
        </div>
      </div>
    </Link>
  );
}
