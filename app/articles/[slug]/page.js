import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "../../../lib/api";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://optikkayumanis.com";

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

  const url = `${SITE_URL}/articles/${article.slug}`;
  const description = article.excerpt || `${article.title} — Baca artikel selengkapnya di Optik Kayumanis.`;

  return {
    title: `${article.title} | Optik Kayumanis`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description,
      url,
      siteName: "Optik Kayumanis",
      type: "article",
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
      images: article.thumbnail
        ? [{ url: article.thumbnail, width: 1200, height: 630, alt: article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.thumbnail ? [article.thumbnail] : [],
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

  const articleUrl = `${SITE_URL}/articles/${article.slug}`;

  // JSON-LD Structured Data untuk Google Search Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": article.thumbnail ? [article.thumbnail] : [],
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Optik Kayumanis",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dpywh4kpe/image/upload/v1787889306/logo_ory2zt.png",
      },
    },
    "author": {
      "@type": "Organization",
      "name": "Optik Kayumanis",
    },
  };

  return (
    <main className="max-w-2xl mx-auto px-5 md:px-8 py-12">
      {/* Schema Markup JSON-LD untuk Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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