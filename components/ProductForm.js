"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: "",
  categoryId: "",
  frameShape: "",
  frameMaterial: "",
  isActive: true,
  isFeatured: false,
};

export default function ProductForm({ initialProduct = null }) {
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Existing images already saved on the product (kept unless removed).
  const [existingImages, setExistingImages] = useState([]);
  // Newly picked files, not uploaded yet — with local preview URLs.
  const [newImages, setNewImages] = useState([]); // [{ file, previewUrl }]

  useEffect(() => {
    api.get("/categories").then((data) => setCategories(data.items));
  }, []);

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price,
        compareAtPrice: initialProduct.compareAtPrice || "",
        sku: initialProduct.sku,
        stock: initialProduct.stock,
        categoryId: initialProduct.categoryId,
        frameShape: initialProduct.frameShape || "",
        frameMaterial: initialProduct.frameMaterial || "",
        isActive: initialProduct.isActive,
        isFeatured: initialProduct.isFeatured,
      });
      setExistingImages(
        (initialProduct.images || [])
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((img) => ({ url: img.url }))
      );
    }
  }, [initialProduct]);

  // Revoke local preview URLs when the component unmounts or files change,
  // to avoid leaking memory.
  useEffect(() => {
    return () => newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
  }, [newImages]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const withPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...withPreviews]);
    e.target.value = ""; // allow selecting the same file again later
  }

  function removeExistingImage(index) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Upload any newly picked files first and get back their public URLs.
      let uploadedUrls = [];
      if (newImages.length) {
        setUploading(true);
        const formData = new FormData();
        newImages.forEach((img) => formData.append("files", img.file));
        const data = await api.upload("/products/upload", formData, token);
        uploadedUrls = data.urls;
        setUploading(false);
      }

      // Final image order: existing (kept) images first, then newly uploaded ones.
      const images = [...existingImages.map((img) => img.url), ...uploadedUrls];

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        sku: form.sku,
        stock: Number(form.stock),
        categoryId: form.categoryId,
        frameShape: form.frameShape || undefined,
        frameMaterial: form.frameMaterial || undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        images,
      };

      if (initialProduct) {
        await api.put(`/products/${initialProduct.id}`, payload, token);
      } else {
        await api.post("/products", payload, token);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm text-bark-500 mb-1">Nama Produk</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-bark-500 mb-1">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-bark-500 mb-1">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Harga Coret (opsional)</label>
          <input
            type="number"
            name="compareAtPrice"
            value={form.compareAtPrice}
            onChange={handleChange}
            min="0"
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-bark-500 mb-1">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Stok</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-bark-500 mb-1">Kategori</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
        >
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-bark-500 mb-1">Bentuk Frame (opsional)</label>
          <input
            name="frameShape"
            value={form.frameShape}
            onChange={handleChange}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Material (opsional)</label>
          <input
            name="frameMaterial"
            value={form.frameMaterial}
            onChange={handleChange}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-bark-500 mb-2">Gambar Produk</label>
        <p className="text-xs text-bark-300 mb-3">
          Gambar pertama akan menjadi gambar utama. Gambar lainnya tampil di bawah gambar utama pada halaman detail produk.
        </p>

        {(existingImages.length > 0 || newImages.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {existingImages.map((img, i) => (
              <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-sand group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-cinnamon-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Utama
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center opacity-0 group-hover:opacity-100 transition"
                  aria-label="Hapus gambar"
                >
                  ×
                </button>
              </div>
            ))}
            {newImages.map((img, i) => (
              <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-sand group">
                <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                {existingImages.length === 0 && i === 0 && (
                  <span className="absolute top-1 left-1 bg-cinnamon-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Utama
                  </span>
                )}
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Baru
                </span>
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center opacity-0 group-hover:opacity-100 transition"
                  aria-label="Hapus gambar"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex items-center gap-2 border border-dashed border-sand rounded-xl px-4 py-3 text-sm text-bark-500 cursor-pointer hover:border-cinnamon-400 hover:text-cinnamon-600">
          <span>+ Upload Gambar (bisa pilih beberapa sekaligus)</span>
          <input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />
        </label>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-bark-500">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Aktif / Tampil di toko
        </label>
        <label className="flex items-center gap-2 text-sm text-bark-500">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
          Tampilkan sebagai unggulan
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-cinnamon-500 text-white px-6 py-3 rounded-full font-medium hover:bg-cinnamon-600 disabled:opacity-50"
      >
        {submitting ? (uploading ? "Mengunggah gambar..." : "Menyimpan...") : initialProduct ? "Simpan Perubahan" : "Tambah Produk"}
      </button>
    </form>
  );
}
