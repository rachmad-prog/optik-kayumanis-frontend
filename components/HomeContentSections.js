"use client";

import { useState } from "react";

function getItemImage(item) {
  return item?.image || item?.imageUrl || "";
}

function fallbackImage(title) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-cinnamon-100 via-cream-card to-cinnamon-400 flex items-center justify-center text-center px-6">
      <span className="font-bold text-cinnamon-700">{title}</span>
    </div>
  );
}

function ArrowButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full border border-beige bg-cream-card text-charcoal hover:text-cinnamon hover:border-cinnamon transition flex items-center justify-center"
      aria-label={direction === "prev" ? "Slide sebelumnya" : "Slide berikutnya"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        {direction === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}

function ImageModal({ item, onClose }) {
  if (!item) return null;
  const image = getItemImage(item);

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 px-4 py-6 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-5xl bg-cream-card rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
          aria-label="Tutup gambar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-video bg-cream">
          {image ? <img src={image} alt={item.title || "Gambar"} className="w-full h-full object-contain" /> : fallbackImage(item.title)}
        </div>
        {(item.title || item.desc) && (
          <div className="p-5">
            {item.title && <h3 className="text-xl font-extrabold text-charcoal">{item.title}</h3>}
            {item.desc && <p className="text-sm text-warmgray mt-2">{item.desc}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ section, eyebrow, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-cinnamon font-semibold uppercase tracking-widest text-xs mb-2">{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal">{section?.title}</h2>
        {section?.subtitle && <p className="text-warmgray mt-3">{section.subtitle}</p>}
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
      <SectionHeader section={section} eyebrow="Layanan">
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
        className="group relative block w-full rounded-2xl overflow-hidden border border-beige bg-cream-card aspect-[16/9] text-left"
      >
        {image ? <img src={image} alt={current.title || section?.title} className="w-full h-full object-cover" /> : fallbackImage(section?.title)}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/75 to-transparent text-cream">
          {current.title && <h3 className="font-extrabold text-xl">{current.title}</h3>}
          {current.desc && <p className="text-sm text-cream/80 mt-1 max-w-2xl">{current.desc}</p>}
          <span className="inline-flex mt-4 px-4 py-2 rounded-full bg-cream text-cinnamon-700 text-sm font-semibold group-hover:bg-cream/90 transition">
            View Images
          </span>
        </div>
      </button>

      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {items.map((item, i) => (
            <button
              type="button"
              key={`${item.title || "layanan"}-${i}`}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all ${active === i ? "w-8 bg-cinnamon" : "w-2.5 bg-cinnamon/30"}`}
              aria-label={`Lihat slide layanan ${i + 1}`}
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
  const ctaHref = section?.ctaHref || ctaFromFooter || "#kontak";
  const ctaLabel = section?.ctaLabel || "Hubungi Kami";

  function go(nextIndex) {
    if (items.length === 0) return;
    setActive((nextIndex + items.length) % items.length);
  }

  return (
    <section id="cabang" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <SectionHeader section={section} eyebrow="Cabang" />

      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6 items-stretch">
        <div className="relative rounded-2xl overflow-hidden border border-beige bg-cream-card aspect-[16/9]">
          {image ? <img src={image} alt={current.title || section?.title} className="w-full h-full object-cover" /> : fallbackImage(section?.title)}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/75 to-transparent text-cream">
            {current.title && <h3 className="font-extrabold text-xl">{current.title}</h3>}
            {current.desc && <p className="text-sm text-cream/80 mt-1 max-w-2xl">{current.desc}</p>}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                onClick={() => setModalItem(current)}
                className="px-4 py-2 rounded-full bg-cream text-cinnamon-700 text-sm font-semibold hover:bg-cream/90 transition"
              >
                View Images
              </button>
              <a
                href={ctaHref}
                target={ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-4 py-2 rounded-full border border-cream/70 text-cream text-sm font-semibold hover:bg-cream/10 transition"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-cinnamon bg-cream-card">
          <button
            type="button"
            onClick={() => setModalItem(current)}
            className="block w-full text-left"
          >
            <div className="aspect-[16/9] bg-cream">
              {image ? <img src={image} alt={current.title || section?.title} className="w-full h-full object-cover" /> : fallbackImage(current.title || section?.title)}
            </div>
            <div className="p-5">
              <p className="text-base font-extrabold text-charcoal">{current.title || `Cabang ${active + 1}`}</p>
              {current.desc && <p className="text-sm text-warmgray mt-2">{current.desc}</p>}
            </div>
          </button>
          {items.length > 1 && (
            <div className="absolute top-4 right-4 flex gap-2">
              <ArrowButton direction="prev" onClick={() => go(active - 1)} />
              <ArrowButton direction="next" onClick={() => go(active + 1)} />
            </div>
          )}
          {items.length > 1 && (
            <div className="px-5 pb-5 flex flex-wrap gap-2">
              {items.map((item, i) => (
                <button
                  type="button"
                  key={`${item.title || "cabang"}-${i}`}
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition-all ${active === i ? "w-8 bg-cinnamon" : "w-2.5 bg-cinnamon/30"}`}
                  aria-label={`Lihat cabang ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ImageModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}

function ShowcaseSlider({ section, id, eyebrow, ctaFromFooter }) {
  const items = section?.items || [];
  const [active, setActive] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const current = items[active] || {};
  const image = getItemImage(current);
  const ctaHref = section?.ctaHref || ctaFromFooter || "#kontak";
  const ctaLabel = section?.ctaLabel || "Hubungi Kami";

  function go(nextIndex) {
    if (items.length === 0) return;
    setActive((nextIndex + items.length) % items.length);
  }

  return (
    <section id={id} className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <SectionHeader section={section} eyebrow={eyebrow}>
        {items.length > 1 && (
          <div className="flex gap-2">
            <ArrowButton direction="prev" onClick={() => go(active - 1)} />
            <ArrowButton direction="next" onClick={() => go(active + 1)} />
          </div>
        )}
      </SectionHeader>

      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6 items-stretch">
        <div className="relative rounded-2xl overflow-hidden border border-beige bg-cream-card aspect-[16/9]">
          {image ? <img src={image} alt={current.title || section?.title} className="w-full h-full object-cover" /> : fallbackImage(section?.title)}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/75 to-transparent text-cream">
            {current.title && <h3 className="font-extrabold text-xl">{current.title}</h3>}
            {current.desc && <p className="text-sm text-cream/80 mt-1 max-w-2xl">{current.desc}</p>}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                onClick={() => setModalItem(current)}
                className="px-4 py-2 rounded-full bg-cream text-cinnamon-700 text-sm font-semibold hover:bg-cream/90 transition"
              >
                View Images
              </button>
              {id === "cabang" && (
                <a
                  href={ctaHref}
                  target={ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="px-4 py-2 rounded-full border border-cream/70 text-cream text-sm font-semibold hover:bg-cream/10 transition"
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
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
    <section className="py-14 bg-cream-card border-y border-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">{sponsors?.title}</h2>
        {sponsors?.subtitle && <p className="text-warmgray mt-2">{sponsors.subtitle}</p>}
      </div>
      <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden">
        <div className="sponsor-track flex gap-5 w-max mx-auto">
          {[...items, ...items, ...items].map((item, i) => (
            <div key={`${item.image || item.name}-${i}`} className="w-44 h-24 rounded-xl border border-beige bg-white flex items-center justify-center p-4">
              {item.image ? <img src={item.image} alt={item.name || "Sponsor"} className="max-w-full max-h-full object-contain" /> : <span className="text-sm font-bold text-cinnamon">{item.name || "Sponsor"}</span>}
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
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal">{contact?.title}</h2>
        {contact?.subtitle && <p className="text-warmgray mt-3">{contact.subtitle}</p>}
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <form
          className="bg-cream-card border border-beige rounded-2xl p-5 md:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") || "";
            const email = formData.get("email") || "";
            const message = formData.get("message") || "";
            const text = encodeURIComponent(
              `Halo Optik Kayumanis, saya ingin bertanya.\n\nNama: ${name}\nEmail: ${email}\nPhone: ${phone}\nPesan: ${message}`
            );
            const href = whatsappBase && whatsappBase !== "#" ? `${whatsappBase}${whatsappBase.includes("?") ? "&" : "?"}text=${text}` : "#";
            window.open(href, "_blank", "noopener,noreferrer");
          }}
        >
          <label className="block mb-4">
            <span className="block text-sm font-semibold text-charcoal mb-1">Nama</span>
            <input required name="name" className="w-full rounded-xl border border-beige px-4 py-3 bg-white focus:outline-none focus:border-cinnamon" />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-semibold text-charcoal mb-1">Email</span>
            <input required type="email" name="email" className="w-full rounded-xl border border-beige px-4 py-3 bg-white focus:outline-none focus:border-cinnamon" />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-semibold text-charcoal mb-1">Phone</span>
            <input
              required
              inputMode="numeric"
              pattern="[0-9]+"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-beige px-4 py-3 bg-white focus:outline-none focus:border-cinnamon"
            />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-semibold text-charcoal mb-1">Pesan</span>
            <textarea required rows={5} name="message" className="w-full rounded-xl border border-beige px-4 py-3 bg-white focus:outline-none focus:border-cinnamon" />
          </label>
          <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-full bg-cinnamon text-cream font-semibold hover:bg-cinnamon-700 transition">
            Kirim Pesan
          </button>
        </form>

        <div className="rounded-2xl overflow-hidden border border-beige bg-cream-card min-h-[360px]">
          {image ? <img src={image} alt={contact?.title || "Kontak Optik Kayumanis"} className="w-full h-full object-cover" /> : fallbackImage(contact?.title || "Kontak Optik Kayumanis")}
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

