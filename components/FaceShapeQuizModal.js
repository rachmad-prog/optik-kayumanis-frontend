"use client";

import { useState } from "react";

const FACE_TYPES = [
  {
    id: "oval",
    title: "Wajah Oval",
    desc: "Proporsional & seimbang. Hampir semua bentuk kacamata cocok!",
    recommendation: "Square, Geometric, Cat Eye, atau Aviator.",
    slug: "square",
    icon: "🥚",
  },
  {
    id: "round",
    title: "Wajah Bulat",
    desc: "Panjang & lebar wajah mirip dengan garis rahang yang lembut.",
    recommendation: "Frame Persegi (Square/Wayfarer) & Geometric agar wajah tampak lebih tegas.",
    slug: "square",
    icon: "⭕",
  },
  {
    id: "square",
    title: "Wajah Kotak / Persegi",
    desc: "Garis rahang tegas dan dahi lebar.",
    recommendation: "Frame Bulat (Round), Cat Eye, atau Aviator untuk melembutkan sudut wajah.",
    slug: "round",
    icon: "🔲",
  },
  {
    id: "heart",
    title: "Wajah Hati",
    desc: "Dahi lebih lebar dengan dagu yang lancip.",
    recommendation: "Frame Bottom-Heavy, Cat Eye, atau Round dengan bingkai tipis/lightweight.",
    slug: "cat-eye",
    icon: "🖤",
  },
];

export default function FaceShapeQuizModal({ isOpen, onClose, onSelectRecommendation }) {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/70 backdrop-blur-md transition-all animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-champagne/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-obsidian hover:bg-slate-200 flex items-center justify-center transition"
          aria-label="Tutup Modal"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-champagne-100 text-champagne-700 text-[11px] font-extrabold uppercase tracking-widest rounded-full mb-2">
            2026 Style Advisor
          </span>
          <h2 className="text-2xl font-extrabold text-obsidian tracking-tight">
            Cari Tahu Shape Kacamata Idealmu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pilih bentuk wajahmu untuk mendapatkan rekomendasi frame yang bikin penampilan makin keren!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {FACE_TYPES.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selected?.id === item.id
                  ? "border-champagne bg-champagne-50/50 shadow-md ring-2 ring-champagne/50"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <h4 className="font-bold text-sm text-obsidian">{item.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="bg-obsidian text-white p-4 rounded-2xl mb-6 animate-slideUp">
            <p className="text-xs text-champagne uppercase font-bold tracking-wider mb-1">
              Rekomendasi Terbaik:
            </p>
            <p className="text-sm font-medium leading-relaxed mb-3">{selected.recommendation}</p>
            <button
              onClick={() => {
                onSelectRecommendation(selected.slug);
                onClose();
              }}
              className="w-full py-2.5 bg-champagne hover:bg-champagne-600 text-obsidian font-bold text-xs rounded-xl tracking-wide uppercase transition shadow-lg"
            >
              Lihat Koleksi Kacamata {selected.title} ➔
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 font-semibold hover:text-obsidian transition"
          >
            Nanti Saja, Saya Ingin Bebas Memilih
          </button>
        </div>
      </div>
    </div>
  );
}
