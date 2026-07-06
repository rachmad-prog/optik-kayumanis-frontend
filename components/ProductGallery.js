"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800";

export default function ProductGallery({ images = [], productName }) {
  const gallery = images.length ? images : [{ url: FALLBACK_IMAGE }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] || gallery[0];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand">
        <Image
          src={active.url}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Other images, positioned below the main image */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {gallery.map((img, i) => (
            <button
              key={img.id || img.url || i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-sand border-2 transition ${
                i === activeIndex ? "border-cinnamon-500" : "border-transparent hover:border-sand-dark"
              }`}
              aria-label={`Lihat gambar ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image src={img.url} alt={`${productName} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
