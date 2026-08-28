"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../lib/defaultContent";

function isExternalHref(href) {
  return /^https?:\/\//i.test(href || "");
}

export default function HeroCarousel({ slides }) {
  const heroSlides = slides?.length ? slides : DEFAULT_CONTENT.hero.slides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="home" className="relative overflow-hidden bg-obsidian-950">
      <div className="relative h-[560px] sm:h-[640px]">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="fade-slide absolute inset-0"
            style={{
              background: slide.image
                ? `linear-gradient(0deg, rgba(9,13,22,0.85), rgba(15,23,42,0.5)), url('${slide.image}') center/cover no-repeat`
                : slideBackground(i),
              opacity: i === current ? 1 : 0,
            }}
          >
            <div className="max-w-7xl mx-auto h-full px-5 md:px-8 flex items-center">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold bg-champagne/20 border border-champagne/40 text-champagne px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-glow">
                  <span>✨</span> {slide.tag || "Koleksi Optik 2026"}
                </span>

                <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5 text-white drop-shadow-md">
                  {slide.title}
                </h1>

                <p className="text-slate-300 text-sm sm:text-lg mb-8 leading-relaxed font-normal max-w-xl">
                  {slide.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {slide.ctaPrimaryLabel && (
                    <Link
                      href={slide.ctaPrimaryHref || "/store"}
                      target={isExternalHref(slide.ctaPrimaryHref) ? "_blank" : undefined}
                      rel={isExternalHref(slide.ctaPrimaryHref) ? "noopener noreferrer" : undefined}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-champagne-gold to-champagne hover:from-champagne hover:to-champagne-600 text-obsidian font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-champagne/20 transform hover:-translate-y-0.5"
                    >
                      {slide.ctaPrimaryLabel}
                    </Link>
                  )}
                  {slide.ctaSecondaryLabel && (
                    <Link
                      href={slide.ctaSecondaryHref || "#layanan"}
                      target={isExternalHref(slide.ctaSecondaryHref) ? "_blank" : undefined}
                      rel={isExternalHref(slide.ctaSecondaryHref) ? "noopener noreferrer" : undefined}
                      className="px-8 py-4 rounded-2xl glass-panel-dark text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider transition-all border border-white/20"
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

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-obsidian-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-champagne shadow-glow" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

const gradients = [
  "linear-gradient(135deg, #090D16 0%, #0F172A 60%, #1E293B 100%)",
  "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #090D16 100%)",
  "linear-gradient(135deg, #1E293B 0%, #090D16 70%, #0F172A 100%)",
];

function slideBackground(index) {
  return gradients[index % gradients.length];
}
