"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { api } from "../../../../lib/api";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/, "");
}

export default function NewArticlePage() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    isPublished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function setField(key, val) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      // Auto-generate slug dari judul
      if (key === "title") {
        next.slug = slugify(val);
      }
      return next;
    });
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
      await api.post("/articles", {
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

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-bark-400 hover:text-bark-700 text-sm"
        >
          ← Kembali
        </button>
        <h1 className="font-display text-2xl font-semibold text-bark-700">Tulis Artikel Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Judul */}
        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Judul Artikel *</label>
          <input
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Contoh: Tips Memilih Frame Kacamata yang Tepat"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">
            Slug URL
            <span className="text-bark-300 font-normal ml-1">(auto dari judul, bisa diedit)</span>
          </label>
          <div className="flex items-center border border-sand rounded-xl overflow-hidden focus-within:border-cinnamon-400">
            <span className="bg-sand px-3 py-2 text-xs text-bark-400 shrink-0">/articles/</span>
            <input
              className="flex-1 px-2 py-2 text-sm focus:outline-none"
              value={form.slug}
              onChange={(e) => setField("slug", slugify(e.target.value))}
              placeholder="tips-memilih-frame-kacamata"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">
            Ringkasan / Excerpt
            <span className="text-bark-300 font-normal ml-1">(ditampilkan di halaman list artikel)</span>
          </label>
          <textarea
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            placeholder="Tuliskan ringkasan singkat artikel ini..."
          />
        </div>

        {/* Konten */}
        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Konten Artikel *</label>
          <textarea
            className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400 font-mono"
            rows={12}
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
            placeholder="Tulis isi artikel di sini. Mendukung HTML dasar seperti <h2>, <p>, <strong>, <ul>, <li>."
            required
          />
          <p className="text-xs text-bark-300 mt-1">Mendukung HTML dasar: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;.</p>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-semibold text-bark-700 mb-1">Gambar Thumbnail</label>
          {form.thumbnail && (
            <div className="mb-2 relative w-40 h-28 rounded-xl overflow-hidden border border-sand">
              <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setField("thumbnail", "")}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              >
                ×
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 cursor-pointer bg-sand hover:bg-sand/80 text-bark-600 text-sm px-4 py-2 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {uploading ? "Mengupload..." : "Upload Gambar"}
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

        {/* Status */}
        <div className="flex items-center gap-3 bg-white border border-sand rounded-xl px-4 py-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setField("isPublished", e.target.checked)}
            className="w-4 h-4 accent-cinnamon-500"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-bark-700 cursor-pointer">
            Publish sekarang
            <span className="block text-xs text-bark-300 font-normal">Jika tidak dicentang, artikel tersimpan sebagai Draft dan tidak terlihat di website publik.</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-cinnamon-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-cinnamon-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : form.isPublished ? "Simpan & Publish" : "Simpan sebagai Draft"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-bark-500 border border-sand hover:bg-sand"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
