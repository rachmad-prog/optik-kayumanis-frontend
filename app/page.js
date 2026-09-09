import Link from "next/link";
import { api } from "../lib/api";
import HeroCarousel from "../components/HeroCarousel";
import HomeContentSections from "../components/HomeContentSections";
import { DEFAULT_CONTENT } from "../lib/defaultContent";
import { isDirectVideoUrl, isEmbeddableLink, toEmbedUrl } from "../lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Builds a wa.me link from a section-specific WhatsApp number + prefilled
// message, so admins can see exactly which number a CTA button points to
// instead of it silently reusing the Footer's WA number. Falls back to
// `fallbackHref` (e.g. the Footer WA link) when no number is set for the
// section, so existing content that hasn't set this yet keeps working.
function buildWaLink(number, message, fallbackHref) {
  const cleanNumber = (number || "").replace(/[^0-9]/g, "");
  if (!cleanNumber) return fallbackHref;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${query}`;
}

async function getSiteContent() {
  try {
    const data = await api.get("/content");
    return { ...DEFAULT_CONTENT, ...data.content };
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function getLatestArticles() {
  try {
    const data = await api.get("/articles?limit=3", null, { cache: "no-store" });
    return data.items || [];
  } catch {
    return [];
  }
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Fixed icon set matched to valueProps items by position (title/desc come from CMS)
const valuePropIcons = [
  <path
    key="i1"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  />,
  <>
    <path
      key="i2a"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z"
    />
    <circle key="i2b" cx="12" cy="12" r="2.5" strokeWidth="1.5" />
  </>,
  <path
    key="i3"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z"
  />,
  <>
    <path
      key="i4a"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 1 1 8.5-8.5Z"
    />
    <path
      key="i4b"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 12h6M8 9h4"
    />
  </>,
];

export default async function HomePage() {
  const [content, articles] = await Promise.all([
    getSiteContent(),
    getLatestArticles(),
  ]);

  const { marquee, valueProps, layanan, tentang } = content;

  return (
    <>
      <HeroCarousel slides={content.hero?.slides} />

      {/* Trust marquee */}
      <div className="bg-cinnamon-700 text-cream/90 py-3 overflow-hidden whitespace-nowrap">
        <div className="marquee-track inline-flex gap-10 text-sm font-medium">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="inline-flex gap-10">
              {marquee.map((item, j) => (
                <span key={j} className="inline-flex gap-10">
                  <span>{item}</span>
                  <span>+</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Value proposition */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-cinnamon font-semibold uppercase tracking-widest text-xs mb-2">
            {valueProps.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
            {valueProps.title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.items.map((v, i) => (
            <div
              key={v.title}
              className="bg-cream-card p-6 rounded-2xl border border-beige hover:shadow-lg hover:-translate-y-1 transition">
              <div className="w-12 h-12 rounded-xl bg-cinnamon/10 flex items-center justify-center text-cinnamon mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  {valuePropIcons[i % valuePropIcons.length]}
                </svg>
              </div>
              <h3 className="font-bold mb-1 text-charcoal">{v.title}</h3>
              <p className="text-sm text-warmgray">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layanan periksa mata */}
      <section id="layanan-periksa-mata" className="bg-amber-50/70 border-y border-amber-200/50 text-charcoal">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-cinnamon font-semibold uppercase tracking-widest text-xs mb-2">
              {layanan.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 text-charcoal">
              {layanan.title}
            </h2>
            <p className="text-slate-600 mb-8">{layanan.description}</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-700">
              {layanan.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-cinnamon" /> {b}
                </li>
              ))}
            </ul>
            <a
              href={buildWaLink(
                layanan.waNumber,
                layanan.waMessage,
                content.footer?.whatsappLink || "https://wa.me/6281234567890",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3.5 rounded-full bg-cinnamon text-white font-semibold hover:bg-cinnamon-600 transition shadow-lg shadow-cinnamon/20">
              {layanan.ctaLabel}
            </a>
          </div>
          {layanan.media ? (
            isDirectVideoUrl(layanan.media) ? (
              <video
                src={layanan.media}
                className="aspect-[4/3] rounded-2xl w-full object-cover shadow-xl border border-amber-200/60"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : isEmbeddableLink(layanan.media) ? (
              <iframe
                src={toEmbedUrl(layanan.media)}
                className="aspect-[4/3] rounded-2xl w-full shadow-xl border border-amber-200/60"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img
                src={layanan.media}
                alt={layanan.title}
                className="aspect-[4/3] rounded-2xl w-full object-cover shadow-xl border border-amber-200/60"
              />
            )
          ) : (
            <div
              className="aspect-[4/3] rounded-2xl shadow-xl border border-amber-200/60"
              style={{ background: "linear-gradient(160deg,#FDBA74,#FED7AA)" }}
            />
          )}
        </div>
      </section>

      {/* Tentang kami */}
      <section
        id="tentang"
        className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
        {tentang.media ? (
          isDirectVideoUrl(tentang.media) ? (
            <video
              src={tentang.media}
              className="aspect-[4/3] rounded-2xl order-2 lg:order-1 w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : isEmbeddableLink(tentang.media) ? (
            <iframe
              src={toEmbedUrl(tentang.media)}
              className="aspect-[4/3] rounded-2xl order-2 lg:order-1 w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <img
              src={tentang.media}
              alt={tentang.title}
              className="aspect-[4/3] rounded-2xl order-2 lg:order-1 w-full object-cover"
            />
          )
        ) : (
          <div
            className="aspect-[4/3] rounded-2xl order-2 lg:order-1"
            style={{ background: "linear-gradient(160deg,#E4D8C8,#8B5E3C)" }}
          />
        )}
        <div className="order-1 lg:order-2">
          <p className="text-cinnamon font-semibold uppercase tracking-widest text-xs mb-2">
            {tentang.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 text-charcoal">
            {tentang.title}
          </h2>
          <p className="text-warmgray mb-6">{tentang.description}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {tentang.stats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold text-cinnamon">
                  {s.value}
                </p>
                <p className="text-xs text-warmgray">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeContentSections content={content} />

      {/* Artikel & Edukasi Terbaru Section */}
      {articles.length > 0 && (
        <section id="artikel" className="max-w-7xl mx-auto px-5 md:px-8 py-20 border-t border-sand">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block px-3 py-1 bg-champagne-100 text-champagne-700 font-extrabold uppercase tracking-widest text-[11px] rounded-full mb-3">
                Edukasi &amp; Blog Terbaru
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
                Artikel Seputar Kesehatan Mata
              </h2>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Tips perawatan mata, panduan memilih frame &amp; lensa dari tim optometris Optik Kayumanis.
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full bg-obsidian text-white hover:bg-cinnamon font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0"
            >
              Lihat Semua Artikel &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group bg-white border border-sand rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
              >
                {a.thumbnail ? (
                  <div className="aspect-video overflow-hidden bg-sand/30">
                    <img
                      src={a.thumbnail}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-sand/40 flex items-center justify-center text-bark-300">
                    <span className="text-3xl">📰</span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-cinnamon mb-2">
                      {formatDate(a.publishedAt || a.createdAt)}
                    </p>
                    <h3 className="font-bold text-lg text-charcoal group-hover:text-cinnamon transition-colors line-clamp-2 leading-snug mb-2">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-sand/60 flex items-center text-xs font-bold text-cinnamon group-hover:translate-x-1 transition-transform">
                    Baca Selengkapnya &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
