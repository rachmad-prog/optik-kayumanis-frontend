"use client";

import { useState } from "react";

function getItemImage(item) {
  return item?.image || item?.imageUrl || "";
}

function buildBranchCtaHref(baseHref, branchName) {
  if (!baseHref) return baseHref;
  const isWhatsapp = /wa\.me|api\.whatsapp\.com/i.test(baseHref);
  if (!isWhatsapp || !branchName) return baseHref;

  const [base, existingQuery] = baseHref.split("?");
  const params = new URLSearchParams(existingQuery || "");
  params.set("text", `Halo Optik Kayumanis, saya ingin konsultasi/tanya tentang ${branchName}`);
  return `${base}?${params.toString()}`;
}

function fallbackImage(title) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-obsidian-800 via-obsidian to-slate-900 flex flex-col items-center justify-center text-center p-8 text-white">
      <span className="text-3xl mb-2">👓</span>
      <span className="font-extrabold text-base tracking-tight text-champagne">{title}</span>
    </div>
  );
}

function ArrowButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full border border-slate-200 bg-white text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-300 shadow-sm flex items-center justify-center"
      aria-label={direction === "prev" ? "Slide sebelumnya" : "Slide berikutnya"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
        {direction === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}

function ImageModal({ item, onClose }) {
  if (!item) return null;
  const image = getItemImage(item);

  return (
    <div
      className="fixed inset-0 z-[70] bg-obsidian/80 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian/80 text-white flex items-center justify-center hover:bg-obsidian transition"
          aria-label="Tutup"
        >
          ✕
        </button>
        <div className="aspect-video bg-slate-900">
          {image ? (
            <img src={image} alt={item.title || "Gambar"} className="w-full h-full object-contain" />
          ) : (
            fallbackImage(item.title)
          )}
        </div>
        {(item.title || item.desc) && (
          <div className="p-6">
            {item.title && <h3 className="text-2xl font-extrabold text-obsidian">{item.title}</h3>}
            {item.desc && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.desc}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ section, eyebrow, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="inline-block px-3 py-1 bg-champagne-100 text-champagne-700 font-extrabold uppercase tracking-widest text-[11px] rounded-full mb-3">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-obsidian tracking-tight leading-tight">
          {section?.title}
        </h2>
        {section?.subtitle && <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed">{section.subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function LayananSlider({ section }) {
  const items = section?.items || [];
  const [active, setActive] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const current = items[active] || {};
  const image = getItemImage(current);

  function go(nextIndex) {
    if (items.length === 0) return;
    setActive((nextIndex + items.length) % items.length);
  }

  return (
    <section id="layanan" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <SectionHeader section={section} eyebrow="Standard Eyecare 2026">
        {items.length > 1 && (
          <div className="flex gap-2">
            <ArrowButton direction="prev" onClick={() => go(active - 1)} />
            <ArrowButton direction="next" onClick={() => go(active + 1)} />
          </div>
        )}
      </SectionHeader>

      <button
        type="button"
        onClick={() => setModalItem(current)}
        className="group relative block w-full rounded-3xl overflow-hidden border border-slate-100 bg-white aspect-[16/9] text-left shadow-2xl shadow-obsidian/5 hover:shadow-obsidian/15 transition duration-500"
      >
        {image ? (
          <img
            src={image}
            alt={current.title || section?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          fallbackImage(section?.title)
        )}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-transparent text-white">
          {current.title && <h3 className="font-extrabold text-2xl sm:text-3xl text-white">{current.title}</h3>}
          {current.desc && <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">{current.desc}</p>}
          <span className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl bg-champagne text-obsidian font-extrabold text-xs uppercase tracking-wider group-hover:bg-champagne-gold transition shadow-lg">
            <span>🔍 Zoom Galeri Foto</span>
          </span>
        </div>
      </button>

      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((item, i) => (
            <button
              type="button"
              key={`${item.title || "layanan"}-${i}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-champagne" : "w-2 bg-slate-300"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      <ImageModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}

function CabangSlider({ section, ctaFromFooter }) {
  const items = section?.items || [];
  const [active, setActive] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const current = items[active] || {};
  const image = getItemImage(current);
  const baseCtaHref = section?.ctaHref || ctaFromFooter || "#kontak";
  const ctaHref = buildBranchCtaHref(baseCtaHref, current.title);
  const ctaLabel = section?.ctaLabel || "Konsultasi Cabang Ini";

  function go(nextIndex) {
    if (items.length === 0) return;
    setActive((nextIndex + items.length) % items.length);
  }

  return (
    <section id="cabang" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <SectionHeader section={section} eyebrow="Lokasi Outlet Resmi" />

      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-8 items-stretch">
        <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-white aspect-[16/9] shadow-xl">
          {image ? (
            <img src={image} alt={current.title || section?.title} className="w-full h-full object-cover" />
          ) : (
            fallbackImage(section?.title)
          )}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-transparent text-white">
            {current.title && <h3 className="font-extrabold text-2xl text-white">{current.title}</h3>}
            {current.desc && <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">{current.desc}</p>}
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={() => setModalItem(current)}
                className="px-5 py-2.5 rounded-xl bg-white text-obsidian text-xs font-extrabold hover:bg-champagne transition shadow-md"
              >
                Lihat Foto Outlet
              </button>
              <a
                href={ctaHref}
                target={ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-5 py-2.5 rounded-xl bg-champagne text-obsidian text-xs font-extrabold hover:bg-champagne-600 transition shadow-md"
              >
                💬 {ctaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-champagne-600 bg-champagne-50 px-3 py-1 rounded-full inline-block mb-3">
              Outlet Selected ({active + 1}/{items.length || 1})
            </span>
            <h4 className="text-xl font-extrabold text-obsidian mb-2">{current.title || `Cabang ${active + 1}`}</h4>
            {current.desc && <p className="text-xs text-slate-500 leading-relaxed mb-6">{current.desc}</p>}

            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-champagne font-bold">✓</span> Periksa Mata Gratis (Autorefractometer)
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-champagne font-bold">✓</span> Garansi Penyetelan Frame & Ultra-Clean
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-champagne font-bold">✓</span> Ribuan Pilihan Frame Trending
              </div>
            </div>
          </div>

          {items.length > 1 && (
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Pilih Cabang Lain:</span>
              <div className="flex gap-2">
                <ArrowButton direction="prev" onClick={() => go(active - 1)} />
                <ArrowButton direction="next" onClick={() => go(active + 1)} />
              </div>
            </div>
          )}
        </div>
      </div>
      <ImageModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}

function SponsorSlider({ sponsors }) {
  const items = sponsors?.items || [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 border-y border-slate-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-8 text-center">
        <span className="text-xs uppercase tracking-widest font-extrabold text-champagne mb-2 inline-block">
          Official Lens & Frame Partners
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          {sponsors?.title || "Brand Optik Terpercaya"}
        </h2>
        {sponsors?.subtitle && <p className="text-slate-400 text-sm mt-2">{sponsors.subtitle}</p>}
      </div>
      <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden">
        <div className="sponsor-track flex gap-6 w-max mx-auto">
          {[...items, ...items, ...items].map((item, i) => (
            <div
              key={`${item.image || item.name}-${i}`}
              className="w-48 h-24 rounded-2xl border border-slate-800 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-5 shadow-lg"
            >
              {item.image ? (
                <img src={item.image} alt={item.name || "Brand"} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-sm font-extrabold text-champagne tracking-wider">{item.name || "Brand"}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ contact, footer }) {
  const [phone, setPhone] = useState("");
  const whatsappBase = footer?.whatsappLink || "#";
  const image = contact?.image || "";

  return (
    <section id="kontak" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold uppercase tracking-widest text-champagne-600 bg-champagne-50 px-3.5 py-1 rounded-full inline-block mb-3">
          Customer Service & Booking
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
          {contact?.title || "Hubungi Tim Optik Kayumanis"}
        </h2>
        {contact?.subtitle && <p className="text-slate-500 text-sm sm:text-base mt-3">{contact.subtitle}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        <form
          className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") || "";
            const email = formData.get("email") || "";
            const message = formData.get("message") || "";
            const text = encodeURIComponent(
              `Halo Optik Kayumanis, saya ingin pesan/konsultasi.\n\nNama: ${name}\nEmail: ${email}\nNo HP: ${phone}\nPesan: ${message}`
            );
            const href =
              whatsappBase && whatsappBase !== "#"
                ? `${whatsappBase}${whatsappBase.includes("?") ? "&" : "?"}text=${text}`
                : "#";
            window.open(href, "_blank", "noopener,noreferrer");
          }}
        >
          <label className="block mb-5">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-2">Nama Lengkap</span>
            <input
              required
              name="name"
              placeholder="Masukkan nama Anda"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 bg-slate-50 text-xs md:text-sm text-obsidian focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition"
            />
          </label>
          <label className="block mb-5">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-2">Alamat Email</span>
            <input
              required
              type="email"
              name="email"
              placeholder="nama@email.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 bg-slate-50 text-xs md:text-sm text-obsidian focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition"
            />
          </label>
          <label className="block mb-5">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-2">Nomor WhatsApp</span>
            <input
              required
              inputMode="numeric"
              pattern="[0-9]+"
              value={phone}
              placeholder="081234567890"
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 bg-slate-50 text-xs md:text-sm text-obsidian focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition"
            />
          </label>
          <label className="block mb-6">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-obsidian mb-2">Pesan / Konsultasi Lensa</span>
            <textarea
              required
              rows={4}
              name="message"
              placeholder="Tuliskan pesan, ukuran minus, atau pertanyaan Anda di sini..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 bg-slate-50 text-xs md:text-sm text-obsidian focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition"
            />
          </label>
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-obsidian text-white font-extrabold text-xs uppercase tracking-wider hover:bg-champagne hover:text-obsidian transition-all shadow-xl shadow-obsidian/20"
          >
            💬 Kirim Pesan via WhatsApp
          </button>
        </form>

        <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-900 shadow-2xl min-h-[360px] relative">
          {image ? (
            <img src={image} alt={contact?.title || "Kontak Optik Kayumanis"} className="w-full h-full object-cover" />
          ) : (
            fallbackImage(contact?.title || "Kontak Optik Kayumanis")
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent p-8 flex flex-col justify-end">
            <p className="text-xs uppercase font-extrabold tracking-widest text-champagne mb-1">Standar Pelayanan 2026</p>
            <p className="text-xl font-extrabold text-white">Layanan Konsultasi Cepat & Ramah</p>
            <p className="text-xs text-slate-300 mt-1">Tim optometris kami siap membantu menentukan jenis lensa dan ukuran frame paling tepat untukmu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeContentSections({ content }) {
  return (
    <>
      <LayananSlider section={content.layananSlider} />
      <CabangSlider section={content.cabang} ctaFromFooter={content.footer?.whatsappLink} />
      <SponsorSlider sponsors={content.sponsors} />
      <ContactSection contact={content.kontak} footer={content.footer} />
    </>
  );
}
