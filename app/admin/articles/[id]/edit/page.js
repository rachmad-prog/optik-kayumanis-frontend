"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { api } from "../../../../../lib/api";
import RichTextEditor from "../../../../../components/RichTextEditor";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/, "");
}

export default function EditArticlePage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !id) return;
    api
      .get(`/articles/admin/id/${id}`, token)
      .then((data) => {
        const a = data.article;
        setForm({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          content: a.content,
          thumbnail: a.thumbnail || "",
          isPublished: a.isPublished,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await api.upload("/articles/upload", fd, token);
      setField("thumbnail", data.urls?.[0] || "");
    } catch (err) {
      alert("Gagal upload gambar: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Judul wajib diisi."); return; }
    if (!form.content.trim()) { setError("Konten wajib diisi."); return; }
    setSaving(true);
    setError(null);
    try {
      await api.put(`/articles/${id}`, {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt || undefined,
        content: form.content,
        thumbnail: form.thumbnail || undefined,
        isPublished: form.isPublished,
      }, token);
      router.push("/admin/articles");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <p className="text-bark-300 text-sm">Memuat artikel...</p>;
  if (error && !form) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-bark-400 hover:text-bark-700 text-sm">
          &larr; Kembali
        </button>
        <h1 className="font-display text-2xl font-semibold text-bark-700">Edit Artikel</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Judul Artikel *</label>
          <input
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Slug URL <span className="text-bark-300 font-normal ml-1">(bisa diedit)</span></label>
          <div className="flex items-center border border-sand rounded-xl overflow-hidden focus-within:border-cinnamon-400">
            <span className="bg-sand px-3 py-2 text-xs text-bark-400 shrink-0">/articles/</span>
            <input
              className="flex-1 px-2 py-2 text-sm focus:outline-none"
              value={form.slug}
              onChange={(e) => setField("slug", slugify(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Ringkasan / Excerpt</label>
          <textarea
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Konten Artikel *</label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => setField("content", html)}
            token={token}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Gambar Cover / Thumbnail Utama</label>
          {form.thumbnail && (
            <div className="mb-2 relative w-40 h-28 rounded-xl overflow-hidden border border-sand">
              <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setField("thumbnail", "")}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                ×
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 cursor-pointer bg-sand hover:bg-sand/80 text-bark-600 text-sm px-4 py-2 rounded-xl">
            {uploading ? "Mengupload..." : "Upload Gambar Cover"}
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploading} />
          </label>
          <p className="text-xs text-bark-300 mt-1">Atau isi URL gambar langsung:</p>
          <input
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400 mt-1"
            value={form.thumbnail}
            onChange={(e) => setField("thumbnail", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-3 bg-white border border-sand rounded-xl px-4 py-3">
          <input type="checkbox" id="isPublished" checked={form.isPublished}
            onChange={(e) => setField("isPublished", e.target.checked)} className="w-4 h-4 accent-cinnamon-500" />
          <label htmlFor="isPublished" className="text-sm font-medium text-bark-700 cursor-pointer">
            Published (tampil di website)
            <span className="block text-xs text-bark-300 font-normal">Jika tidak dicentang, tersimpan sebagai Draft.</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || uploading}
            className="bg-cinnamon-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-cinnamon-600 disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-bark-500 border border-sand hover:bg-sand">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}