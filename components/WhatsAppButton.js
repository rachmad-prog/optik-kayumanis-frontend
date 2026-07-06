"use client";

import { useState } from "react";

const RESPONSES = {
  1: {
    label: "1. Informasi Layanan Medical Check up",
    text: "Pelayanan medical check up untuk Perusahaan, Sekolah dan Yayasan yang ditangani oleh Optometris.",
  },
  2: {
    label: "2. Informasi layanan home visit",
    text: "Layanan Home visit/pemeriksaan mata ke rumah.",
  },
  3: {
    label: "3. Informasi kacamata, safety glass dan lensa bergaransi",
    text: "Produk Kacamata, Frame, Lensa bergaransi, Safety Glass serta Softlens",
  },
};

const WA_NUMBER = "62817160196";

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C22 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24 2.21 0 4.28.86 5.84 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.55-3.71 8.23-8.27 8.23z" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  // view: "menu" | number (selected option id)
  const [view, setView] = useState("menu");

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (next) setView("menu");
      return next;
    });
  }

  function close() {
    setOpen(false);
  }

  function backToMenu() {
    setView("menu");
  }

  const selected = typeof view === "number" ? RESPONSES[view] : null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[300px] max-w-[85vw] bg-white rounded-2xl shadow-xl border border-beige overflow-hidden">
          <div className="bg-sage text-white px-4 py-3 flex items-center justify-between">
            <p className="font-semibold text-sm">Butuh Bantuan?</p>
            <button onClick={close} aria-label="Tutup" className="hover:opacity-80">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {view === "menu" ? (
              <>
                <p className="font-bold text-sm text-charcoal mb-3">
                  Pilih Informasi yang Anda Butuhkan:
                </p>
                <div className="flex flex-col gap-2">
                  {Object.entries(RESPONSES).map(([id, r]) => (
                    <button
                      key={id}
                      onClick={() => setView(Number(id))}
                      className="text-left text-sm px-3 py-2 rounded-xl border border-beige hover:border-sage hover:bg-sage/5 transition text-charcoal"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-bold text-sm text-charcoal mb-2">Informasi</p>
                <p className="text-sm text-warmgray leading-relaxed mb-3">{selected.text}</p>
                <hr className="border-beige mb-3" />
                <p className="text-sm text-charcoal mb-3">
                  Silahkan kontak kami atau hubungi kami ke nomor WA:
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    "Halo, saya ingin bertanya lebih lanjut mengenai: " + selected.text
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition"
                >
                  Hubungi Kami via WhatsApp
                </a>
                <button
                  onClick={backToMenu}
                  className="mt-3 text-xs text-warmgray hover:text-cinnamon"
                >
                  ← Menu Utama
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label="Chat WhatsApp"
        className="w-14 h-14 rounded-full bg-sage flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        {open ? <CloseIcon className="w-6 h-6 text-white" /> : <ChatIcon className="w-7 h-7 text-white" />}
      </button>
    </div>
  );
}
