"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminArticlesPage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadArticles() {
    setLoading(true);
    setError(null);
    api
      .get("/articles/admin/all", token)
      .then((data) => setArticles(data.items || []))
      .catch((err) => setError(err.message || "Gagal memuat artikel."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token) loadArticles();
  }, [token]);

  async function handleDelete(id, title) {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await api.del(`/articles/${id}`, token);
      loadArticles();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleTogglePublish(article) {
    try {
      await api.put(
        `/articles/${article.id}`,
        { isPublished: !article.isPublished },
        token
      );
      loadArticles();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700">Kelola Artikel</h1>
        <Link
          href="/admin/articles/new"
          className="bg-cinnamon-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-cinnamon-600"
        >
          + Tulis Artikel
        </Link>
      </div>

      {loading ? (
        <p className="text-bark-300 text-sm">Memuat artikel...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-sand rounded-2xl p-10 text-center">
          <p className="text-bark-400 text-sm mb-4">Belum ada artikel. Tulis artikel pertama Anda!</p>
          <Link href="/admin/articles/new" className="text-cinnamon-600 text-sm font-semibold hover:underline">
            + Tulis Artikel Baru
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-sand rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sand/60 text-bark-500 text-left">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal Publish</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-t border-sand">
                    <td className="px-4 py-3 text-bark-700 font-medium max-w-xs">
                      <p className="truncate">{a.title}</p>
                      <p className="text-xs text-bark-300 mt-0.5 font-mono">/articles/{a.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(a)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                          a.isPublished
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {a.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-bark-500">{formatDate(a.publishedAt)}</td>
                    <td className="px-4 py-3 text-bark-400">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          className="text-xs font-semibold text-cinnamon-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.title)}
                          className="text-xs font-semibold text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {articles.map((a) => (
              <div key={a.id} className="bg-white border border-sand rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-bark-700 text-sm leading-snug">{a.title}</p>
                  <button
                    onClick={() => handleTogglePublish(a)}
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      a.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {a.isPublished ? "Published" : "Draft"}
                  </button>
                </div>
                <p className="text-xs text-bark-300 font-mono mb-3">/articles/{a.slug}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-bark-400">{formatDate(a.createdAt)}</p>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-xs font-semibold text-cinnamon-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
