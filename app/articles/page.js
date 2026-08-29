import Link from "next/link";
import { api } from "../../lib/api";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://optikkayumanis.com";

export const metadata = {
  title: "Artikel & Edukasi Kesehatan Mata | Optik Kayumanis",
  description: "Tips perawatan mata, panduan memilih kacamata & lensa, serta informasi promo terbaru dari Optik Kayumanis.",
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
  openGraph: {
    title: "Artikel & Edukasi Kesehatan Mata | Optik Kayumanis",
    description: "Tips perawatan mata, panduan memilih kacamata & lensa, serta informasi promo terbaru dari Optik Kayumanis.",
    url: `${SITE_URL}/articles`,
    siteName: "Optik Kayumanis",
    type: "website",
  },
};


function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getArticles() {
  try {
    const data = await api.get("/articles", null, { next: { revalidate: 60 } });
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-10">
        <p className="text-cinnamon-500 text-sm font-semibold uppercase tracking-wider mb-2">Blog</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-bark-700">Artikel Optik Kayumanis</h1>
        <p className="text-bark-400 mt-2">Tips perawatan mata, panduan memilih kacamata, dan informasi terbaru dari kami.</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-bark-300 text-lg">Belum ada artikel yang dipublikasikan.</p>
          <Link href="/" className="mt-4 inline-block text-cinnamon-600 text-sm font-semibold hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group bg-white border border-sand rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {a.thumbnail ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={a.thumbnail}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-sand/50 flex items-center justify-center">
                  <svg className="text-bark-200" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-bark-300 mb-2">{formatDate(a.publishedAt || a.createdAt)}</p>
                <h2 className="font-semibold text-bark-700 leading-snug mb-2 group-hover:text-cinnamon-600 transition-colors line-clamp-2">
                  {a.title}
                </h2>
                {a.excerpt && (
                  <p className="text-sm text-bark-400 line-clamp-2">{a.excerpt}</p>
                )}
                <p className="mt-3 text-xs font-semibold text-cinnamon-600 group-hover:underline">Baca selengkapnya &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}