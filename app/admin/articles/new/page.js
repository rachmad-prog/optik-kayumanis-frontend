"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { api } from "../../../../lib/api";
import RichTextEditor from "../../../../components/RichTextEditor";

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
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-bark-400 hover:text-bark-700 text-sm"
        >
          &larr; Kembali
        </button>
        <h1 className="font-display text-2xl font-semibold text-bark-700">Tulis Artikel Baru</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* SISI KIRI: Form Utama (Judul, Slug, Excerpt, Content) */}
          <div className="space-y-5">
            {/* Judul */}
            <div>
              <label className="block text-sm font-semibold text-bark-700 mb-1">Judul Artikel *</label>
              <input
                className="w-full border border-sand rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cinnamon-400 font-medium"
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
                <span className="bg-sand px-3 py-2.5 text-xs text-bark-400 shrink-0">/articles/</span>
                <input
                  className="flex-1 px-2.5 py-2.5 text-sm focus:outline-none font-mono"
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
                <span className="text-bark-300 font-normal ml-1">(ditampilkan di daftar artikel &amp; Google)</span>
              </label>
              <textarea
                className="w-full border border-sand rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cinnamon-400"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="Tuliskan ringkasan singkat artikel ini..."
              />
            </div>

            {/* Konten Artikel Visual Rich Text Editor */}
            <div>
              <label className="block text-sm font-semibold text-bark-700 mb-1">Konten Artikel *</label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setField("content", html)}
                token={token}
              />
            </div>
          </div>

          {/* SISI KANAN: Sidebar Panel (Publish & Thumbnail) */}
          <div className="space-y-5 sticky top-6">
            {/* Card 1: Publikasi & Simpan */}
            <div className="bg-white border border-sand rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-bark-700 text-sm border-b border-sand pb-3">Publikasi</h2>

              <div className="flex items-start gap-3 bg-sand/40 border border-sand rounded-xl p-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setField("isPublished", e.target.checked)}
                  className="w-4 h-4 accent-cinnamon-500 mt-0.5 cursor-pointer shrink-0"
                />
                <label htmlFor="isPublished" className="text-xs text-bark-700 cursor-pointer select-none">
                  <span className="font-semibold block">Publish sekarang</span>
                  <span className="text-bark-400">Jika tidak dicentang, artikel tersimpan sebagai Draft.</span>
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="w-full bg-cinnamon-500 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-cinnamon-600 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {saving ? "Menyimpan..." : form.isPublished ? "Simpan &amp; Publish" : "Simpan sebagai Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-bark-500 border border-sand hover:bg-sand transition-colors text-center"
                >
                  Batal
                </button>
              </div>
            </div>

            {/* Card 2: Gambar Cover / Thumbnail Utama */}
            <div className="bg-white border border-sand rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-bark-700 text-sm border-b border-sand pb-3">Gambar Cover / Thumbnail</h2>

              {form.thumbnail ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-sand group">
                  <img src={form.thumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setField("thumbnail", "")}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                    title="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-sand rounded-xl p-4 text-center bg-sand/20">
                  <svg className="mx-auto text-bark-300 mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-xs text-bark-400 mb-3">Belum ada gambar cover</p>
                </div>
              )}

              <label className="w-full inline-flex items-center justify-center gap-2 cursor-pointer bg-sand hover:bg-sand/80 text-bark-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {uploading ? "Mengupload..." : "Upload Gambar Cover"}
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploading} />
              </label>

              <div>
                <span className="block text-[11px] text-bark-400 mb-1">Atau isi URL gambar langsung:</span>
                <input
                  className="w-full border border-sand rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cinnamon-400 font-mono"
                  value={form.thumbnail}
                  onChange={(e) => setField("thumbnail", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}