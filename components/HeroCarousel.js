"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../lib/defaultContent";

// Full URLs (https://wa.me/..., https://instagram.com/..., etc) are opened in a
// new tab so visitors don't lose the store page; internal paths/anchors navigate normally.
function isExternalHref(href) {
  return /^https?:\/\//i.test(href || "");
}

export default function HeroCarousel({ slides }) {
  const heroSlides = slides?.length ? slides : DEFAULT_CONTENT.hero.slides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="relative h-[520px] sm:h-[600px]">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="fade-slide absolute inset-0"
            style={{
              background: slide.image
                ? `linear-gradient(0deg, rgba(20,14,10,0.55), rgba(20,14,10,0.35)), url('${slide.image}') center/cover no-repeat`
                : slideBackground(i),
              opacity: i === current ? 1 : 0,
            }}
          >
            <div className="max-w-7xl mx-auto h-full px-5 md:px-8 flex items-center">
              <div className="max-w-xl text-cream">
                <span className="inline-block text-xs uppercase tracking-widest bg-cream/15 px-3 py-1 rounded-full mb-4">
                  {slide.tag}
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">{slide.title}</h1>
                <p className="text-cream/85 mb-8">{slide.desc}</p>
                <div className="flex flex-wrap gap-3">
                  {slide.ctaPrimaryLabel && (
                    <Link
                      href={slide.ctaPrimaryHref || "/shop"}
                      target={isExternalHref(slide.ctaPrimaryHref) ? "_blank" : undefined}
                      rel={isExternalHref(slide.ctaPrimaryHref) ? "noopener noreferrer" : undefined}
                      className="px-6 py-3 rounded-full bg-cream text-cinnamon-700 font-semibold hover:bg-cream/90 transition"
                    >
                      {slide.ctaPrimaryLabel}
                    </Link>
                  )}
                  {slide.ctaSecondaryLabel && (
                    <Link
                      href={slide.ctaSecondaryHref || "#layanan"}
                      target={isExternalHref(slide.ctaSecondaryHref) ? "_blank" : undefined}
                      rel={isExternalHref(slide.ctaSecondaryHref) ? "noopener noreferrer" : undefined}
                      className="px-6 py-3 rounded-full border border-cream/40 text-cream font-semibold hover:bg-cream/10 transition"
                    >
                      {slide.ctaSecondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${i === current ? "bg-cream" : "bg-cream/50"}`}
          />
        ))}
      </div>
    </section>
  );
}

// Rotating set of on-brand gradients applied by slide position (kept in code, not CMS,
// since a color-picker for gradients isn't worth the admin complexity).
const gradients = [
  "linear-gradient(120deg,#4A2E1E 0%,#8B5E3C 60%,#A8794F 100%)",
  "linear-gradient(120deg,#2A2622 0%,#7A756D 60%,#8B5E3C 100%)",
  "linear-gradient(120deg,#6E8B63 0%,#4A2E1E 70%,#2A2622 100%)",
];
function slideBackground(index) {
  return gradients[index % gradients.length];
}
