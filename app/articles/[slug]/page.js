import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../../lib/api";

export const revalidate = 60;

async function getArticle(slug) {
  try {
    const data = await api.get(`/articles/${slug}`, null, { next: { revalidate: 60 } });
    return data.article;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: `${article.title} - Optik Kayumanis`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
  };
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticleDetailPage({ params }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <main className="max-w-2xl mx-auto px-5 md:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-bark-300 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-cinnamon-600">Beranda</Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-cinnamon-600">Artikel</Link>
        <span>/</span>
        <span className="text-bark-500 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="text-cinnamon-500 text-xs font-semibold uppercase tracking-wider mb-3">
          {formatDate(article.publishedAt || article.createdAt)}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-bark-700 leading-tight mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-bark-400 text-lg leading-relaxed">{article.excerpt}</p>
        )}
      </header>

      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Konten */}
      <article
        className="prose prose-sm md:prose-base prose-bark max-w-none
          prose-headings:font-display prose-headings:text-bark-700
          prose-p:text-bark-600 prose-p:leading-relaxed
          prose-a:text-cinnamon-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-bark-700
          prose-li:text-bark-600
          prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Footer artikel */}
      <div className="mt-12 pt-8 border-t border-sand">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-cinnamon-600 text-sm font-semibold hover:underline"
        >
          &larr; Kembali ke semua artikel
        </Link>
      </div>
    </main>
  );
}