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
      className="group block bg-cream-card rounded-2xl border border-beige overflow-hidden hover:shadow-lg transition"
    >
      <div className="relative aspect-square bg-beige overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {discounted && (
          <span className="absolute top-3 left-3 bg-cinnamon text-cream text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Diskon
          </span>
        )}
        {product.isFeatured && !discounted && (
          <span className="absolute top-3 left-3 bg-cinnamon text-cream text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-warmgray mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-sm mb-1 text-charcoal leading-snug">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-cinnamon font-bold text-sm">{formatRupiah(product.price)}</span>
          {discounted && (
            <span className="text-xs text-warmgray line-through">{formatRupiah(product.compareAtPrice)}</span>
          )}
        </div>
        <span className="block w-full text-center text-xs font-semibold py-2 rounded-full border border-charcoal/20 group-hover:bg-cinnamon group-hover:text-cream group-hover:border-cinnamon transition">
          Lihat Detail
        </span>
      </div>
    </Link>
  );
}
