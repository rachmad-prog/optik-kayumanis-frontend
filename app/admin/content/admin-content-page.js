"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { DEFAULT_CONTENT } from "../../../lib/defaultContent";
import {
  isDirectVideoUrl,
  isEmbeddableLink,
  toEmbedUrl,
} from "../../../lib/media";

function Field({ label, value, onChange, textarea, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-bark-700 mb-1">
        {label}
      </span>
      {hint && <span className="block text-xs text-bark-300 mb-1">{hint}</span>}
      {textarea ? (
        <textarea
          className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Section({ title, children, onSave, saving, status }) {
  return (
    <div className="bg-white border border-sand rounded-2xl p-6 mb-6">
      <h2 className="font-display text-lg text-bark-700 mb-4">{title}</h2>
      {children}
      {onSave && (
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-sand">
          {status && (
            <p
              className={`text-xs ${status.ok ? "text-cinnamon-600" : "text-red-500"}`}>
              {status.message}
            </p>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="shrink-0 bg-cinnamon-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-cinnamon-600 disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      )}
    </div>
  );
}

function AddRemove({ onAdd, onRemove, addLabel }) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={onAdd}
        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-cinnamon-300 text-cinnamon-600 hover:bg-cinnamon-50">
        + {addLabel}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
          Hapus
        </button>
      )}
    </div>
  );
}

// Reusable image/video picker: shows a live preview (image, direct video file,
// or YouTube/Vimeo embed), a file-upload button, and a manual URL field &
// used anywhere a section has an optional media slot (Layanan, Tentang, etc).
function MediaField({ label, value, onChange, uploading, onUploadFile }) {
  return (
    <div className="mt-2">
      <label className="block mb-2">
        <span className="block text-sm font-semibold text-bark-700 mb-1">
          {label}
        </span>
      </label>
      <div className="w-full aspect-[4/3] max-w-xs rounded-xl border border-sand overflow-hidden bg-cream mb-3">
        {value ? (
          isDirectVideoUrl(value) ? (
            <video
              src={value}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : isEmbeddableLink(value) ? (
            <iframe
              src={toEmbedUrl(value)}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <img src={value} alt="" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-bark-300 text-center px-3">
            Belum ada gambar/video & tampilan memakai gradasi bawaan
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <label className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-cinnamon-300 text-cinnamon-600 hover:bg-cinnamon-50 cursor-pointer">
          <span>
            {uploading
              ? "Mengunggah..."
              : value
                ? "Ganti Gambar"
                : "+ Upload Gambar"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
            Hapus
          </button>
        )}
      </div>
      <Field
        label="Atau tempel link gambar/video"
        value={value || ""}
        onChange={onChange}
        hint="Bisa link gambar (.jpg/.png), video (.mp4/.webm), atau link YouTube/Vimeo."
      />
    </div>
  );
}

// Lets admins upload a manual image for each product category (shown on the
// homepage catalog cards). Independent from the SiteContent JSON blob above &
// this reads/writes the real Category rows via /api/categories.
function CategoryImagesPanel({ token }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [statusById, setStatusById] = useState({});

  useEffect(() => {
    api
      .get("/categories")
      .then((data) => setCategories(data.items))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(cat, file) {
    setUploadingId(cat.id);
    setStatusById((m) => ({ ...m, [cat.id]: null }));
    try {
      const formData = new FormData();
      formData.append("files", file);
      const uploadData = await api.upload("/uploads", formData, token);
      const { category } = await api.put(
        `/categories/${cat.id}`,
        { imageUrl: uploadData.urls[0] },
        token,
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? category : c)),
      );
      setStatusById((m) => ({
        ...m,
        [cat.id]: { ok: true, message: "Tersimpan." },
      }));
    } catch (err) {
      setStatusById((m) => ({
        ...m,
        [cat.id]: { ok: false, message: err.message || "Gagal mengunggah." },
      }));
    } finally {
      setUploadingId(null);
    }
  }

  async function handleRemove(cat) {
    setUploadingId(cat.id);
    try {
      const { category } = await api.put(
        `/categories/${cat.id}`,
        { imageUrl: "" },
        token,
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? category : c)),
      );
      setStatusById((m) => ({ ...m, [cat.id]: null }));
    } catch (err) {
      setStatusById((m) => ({
        ...m,
        [cat.id]: {
          ok: false,
          message: err.message || "Gagal menghapus gambar.",
        },
      }));
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="bg-white border border-sand rounded-2xl p-6 mb-6">
      <h2 className="font-display text-lg text-bark-700 mb-1">
        Gambar Kategori Katalog
      </h2>
      <p className="text-xs text-bark-300 mb-4">
        Upload gambar untuk tiap kategori (mis. "Lensa Kontak"). Gambar ini yang
        tampil di kartu katalog halaman depan.
      </p>

      {loading ? (
        <p className="text-sm text-bark-300">Memuat kategori...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-bark-300">
          Belum ada kategori. Tambahkan lewat menu Produk terlebih dahulu.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border border-sand rounded-xl overflow-hidden">
              <div className="relative h-32 bg-cream">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-bark-300 px-2 text-center">
                    Belum ada gambar
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-bark-700 mb-1">
                  {cat.name}
                </p>
                <p className="text-xs text-bark-300 mb-2">
                  {cat._count?.products || 0} produk
                </p>

                <label className="block text-center text-xs font-semibold px-3 py-1.5 rounded-full border border-cinnamon-300 text-cinnamon-600 hover:bg-cinnamon-50 cursor-pointer">
                  {uploadingId === cat.id
                    ? "Mengunggah..."
                    : cat.imageUrl
                      ? "Ganti Gambar"
                      : "+ Upload Gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingId === cat.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(cat, file);
                      e.target.value = "";
                    }}
                  />
                </label>

                {cat.imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemove(cat)}
                    disabled={uploadingId === cat.id}
                    className="w-full mt-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50">
                    Hapus Gambar
                  </button>
                )}

                {statusById[cat.id] && (
                  <p
                    className={`text-[11px] mt-2 ${statusById[cat.id].ok ? "text-cinnamon-600" : "text-red-500"}`}>
                    {statusById[cat.id].message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContentPage() {
  const { token } = useAuth();
  const [content, setContent] = useState(null);
  const [savingMap, setSavingMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [slideUploading, setSlideUploading] = useState({});
  const [layananMediaUploading, setLayananMediaUploading] = useState(false);
  const [tentangMediaUploading, setTentangMediaUploading] = useState(false);
  const [sliderUploading, setSliderUploading] = useState({});
  const [kontakImageUploading, setKontakImageUploading] = useState(false);

  useEffect(() => {
    api
      .get("/content")
      .then((data) => setContent({ ...DEFAULT_CONTENT, ...data.content }))
      .catch(() => setContent(DEFAULT_CONTENT));
  }, []);

  function update(path, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  function updateArrayItem(arrayPath, index, key, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let arr = next;
      for (const p of arrayPath) arr = arr[p];
      if (key === null) arr[index] = value;
      else arr[index][key] = value;
      return next;
    });
  }

  function addArrayItem(arrayPath, template) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let arr = next;
      for (const p of arrayPath) arr = arr[p];
      arr.push(structuredClone(template));
      return next;
    });
  }

  function removeArrayItem(arrayPath, index) {
    setContent((prev) => {
      const next = structuredClone(prev);
      let arr = next;
      for (const p of arrayPath) arr = arr[p];
      arr.splice(index, 1);
      return next;
    });
  }

  // Uploads a single image for a hero slide and stores its URL on that slide.
  async function uploadSlideImage(i, file) {
    setSlideUploading((m) => ({ ...m, [i]: true }));
    try {
      const formData = new FormData();
      formData.append("files", file);
      const data = await api.upload("/uploads", formData, token);
      updateArrayItem(["hero", "slides"], i, "image", data.urls[0]);
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        heroSlides: {
          ok: false,
          message: err.message || "Gagal mengunggah gambar.",
        },
      }));
    } finally {
      setSlideUploading((m) => ({ ...m, [i]: false }));
    }
  }

  // Uploads an image/video for the Layanan section's right-side media slot.
  async function uploadLayananMedia(file) {
    setLayananMediaUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const data = await api.upload("/uploads", formData, token);
      update(["layanan", "media"], data.urls[0]);
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        layanan: {
          ok: false,
          message: err.message || "Gagal mengunggah file.",
        },
      }));
    } finally {
      setLayananMediaUploading(false);
    }
  }

  // Uploads an image/video for the Tentang Kami section's photo slot.
  async function uploadTentangMedia(file) {
    setTentangMediaUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const data = await api.upload("/uploads", formData, token);
      update(["tentang", "media"], data.urls[0]);
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        tentang: {
          ok: false,
          message: err.message || "Gagal mengunggah file.",
        },
      }));
    } finally {
      setTentangMediaUploading(false);
    }
  }

  async function uploadSliderImage(sectionKey, index, file) {
    const uploadKey = `${sectionKey}-${index}`;
    setSliderUploading((m) => ({ ...m, [uploadKey]: true }));
    try {
      const formData = new FormData();
      formData.append("files", file);
      const data = await api.upload("/uploads", formData, token);
      updateArrayItem([sectionKey, "items"], index, "image", data.urls[0]);
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        [sectionKey]: {
          ok: false,
          message: err.message || "Gagal mengunggah gambar.",
        },
      }));
    } finally {
      setSliderUploading((m) => ({ ...m, [uploadKey]: false }));
    }
  }

  async function uploadKontakImage(file) {
    setKontakImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const data = await api.upload("/uploads", formData, token);
      update(["kontak", "image"], data.urls[0]);
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        kontak: {
          ok: false,
          message: err.message || "Gagal mengunggah gambar.",
        },
      }));
    } finally {
      setKontakImageUploading(false);
    }
  }
  // Saves only the given slice of content (e.g. { hero: { topbarLeft, topbarRight } })
  // instead of the whole page, so each section's button only touches its own data.
  async function saveSection(id, payload) {
    setSavingMap((m) => ({ ...m, [id]: true }));
    setStatusMap((m) => ({ ...m, [id]: null }));
    try {
      await api.put("/content", payload, token);
      setStatusMap((m) => ({
        ...m,
        [id]: {
          ok: true,
          message: "Tersimpan! Perubahan langsung tampil di halaman utama.",
        },
      }));
    } catch (err) {
      setStatusMap((m) => ({
        ...m,
        [id]: { ok: false, message: err.message || "Gagal menyimpan." },
      }));
    } finally {
      setSavingMap((m) => ({ ...m, [id]: false }));
    }
  }

  if (!content)
    return <p className="text-bark-300 text-sm">Memuat konten...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700">
          Konten Halaman
        </h1>
        <p className="text-sm text-bark-300 mt-1">
          Setiap bagian punya tombol simpan sendiri & cukup simpan bagian yang
          Anda ubah.
        </p>
      </div>

      {/* Topbar */}
      <Section
        title="Topbar (garis atas navbar)"
        onSave={() =>
          saveSection("topbar", {
            hero: {
              topbarLeft: content.hero.topbarLeft,
              topbarRight: content.hero.topbarRight,
            },
          })
        }
        saving={savingMap.topbar}
        status={statusMap.topbar}>
        <Field
          label="Teks kiri (desktop)"
          value={content.hero.topbarLeft}
          onChange={(v) => update(["hero", "topbarLeft"], v)}
        />
        <Field
          label="Teks kanan"
          value={content.hero.topbarRight}
          onChange={(v) => update(["hero", "topbarRight"], v)}
        />
      </Section>

      {/* Hero slides */}
      <Section
        title="Hero / Banner Utama"
        onSave={() =>
          saveSection("heroSlides", { hero: { slides: content.hero.slides } })
        }
        saving={savingMap.heroSlides}
        status={statusMap.heroSlides}>
        {content.hero.slides.map((slide, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-4">
            <p className="text-xs font-bold uppercase text-cinnamon-500 mb-3">
              Slide {i + 1}
            </p>

            <label className="block text-sm font-semibold text-bark-700 mb-1">
              Gambar Background
            </label>
            <div className="flex items-center gap-4 mb-4">
              {slide.image ? (
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-sand shrink-0">
                  <img
                    src={slide.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateArrayItem(["hero", "slides"], i, "image", "")
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center"
                    aria-label="Hapus gambar">
                    Ã—
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-video rounded-lg border border-dashed border-sand flex items-center justify-center text-xs text-bark-300 shrink-0">
                  Belum ada
                </div>
              )}
              <label className="inline-flex items-center gap-2 border border-dashed border-sand rounded-xl px-4 py-2.5 text-sm text-bark-500 cursor-pointer hover:border-cinnamon-400 hover:text-cinnamon-600">
                <span>
                  {slideUploading[i]
                    ? "Mengunggah..."
                    : slide.image
                      ? "Ganti Gambar"
                      : "+ Upload Gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={slideUploading[i]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadSlideImage(i, file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-bark-300 mb-4">
              Jika tidak diisi, slide memakai warna gradasi bawaan.
            </p>

            <Field
              label="Label kecil (tag)"
              value={slide.tag}
              onChange={(v) => updateArrayItem(["hero", "slides"], i, "tag", v)}
            />
            <Field
              label="Judul"
              value={slide.title}
              onChange={(v) =>
                updateArrayItem(["hero", "slides"], i, "title", v)
              }
              textarea
            />
            <Field
              label="Deskripsi"
              value={slide.desc}
              onChange={(v) =>
                updateArrayItem(["hero", "slides"], i, "desc", v)
              }
              textarea
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Tombol utama & teks"
                value={slide.ctaPrimaryLabel}
                onChange={(v) =>
                  updateArrayItem(["hero", "slides"], i, "ctaPrimaryLabel", v)
                }
              />
              <Field
                label="Tombol utama & link"
                hint='Bisa path internal ("/shop"), anchor ("#layanan"), atau URL lengkap ("https://wa.me/62...")'
                value={slide.ctaPrimaryHref}
                onChange={(v) =>
                  updateArrayItem(["hero", "slides"], i, "ctaPrimaryHref", v)
                }
              />
              <Field
                label="Tombol kedua & teks (kosongkan jika tidak perlu)"
                value={slide.ctaSecondaryLabel}
                onChange={(v) =>
                  updateArrayItem(["hero", "slides"], i, "ctaSecondaryLabel", v)
                }
              />
              <Field
                label="Tombol kedua & link"
                hint='Bisa path internal ("/shop"), anchor ("#layanan"), atau URL lengkap ("https://wa.me/62...")'
                value={slide.ctaSecondaryHref}
                onChange={(v) =>
                  updateArrayItem(["hero", "slides"], i, "ctaSecondaryHref", v)
                }
              />
            </div>
            <AddRemove
              addLabel="Tambah Slide"
              onAdd={() =>
                addArrayItem(["hero", "slides"], {
                  image: "",
                  tag: "Label Baru",
                  title: "Judul baru",
                  desc: "Deskripsi baru",
                  ctaPrimaryLabel: "Lihat Koleksi",
                  ctaPrimaryHref: "/shop",
                  ctaSecondaryLabel: "",
                  ctaSecondaryHref: "",
                })
              }
              onRemove={
                content.hero.slides.length > 1
                  ? () => removeArrayItem(["hero", "slides"], i)
                  : null
              }
            />
          </div>
        ))}
      </Section>

      {/* Marquee */}
      <Section
        title="Teks Berjalan (Marquee)"
        onSave={() => saveSection("marquee", { marquee: content.marquee })}
        saving={savingMap.marquee}
        status={statusMap.marquee}>
        {content.marquee.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-sand rounded-xl px-3 py-2 text-sm"
              value={item}
              onChange={(e) =>
                setContent((prev) => {
                  const next = structuredClone(prev);
                  next.marquee[i] = e.target.value;
                  return next;
                })
              }
            />
            {content.marquee.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["marquee"], i)}
                className="text-xs px-3 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Teks"
          onAdd={() => addArrayItem(["marquee"], "Teks baru")}
        />
      </Section>

      {/* Value props */}
      <Section
        title='Section "Kenapa Optik Kayumanis"'
        onSave={() =>
          saveSection("valueProps", { valueProps: content.valueProps })
        }
        saving={savingMap.valueProps}
        status={statusMap.valueProps}>
        <Field
          label="Label kecil"
          value={content.valueProps.eyebrow}
          onChange={(v) => update(["valueProps", "eyebrow"], v)}
        />
        <Field
          label="Judul"
          value={content.valueProps.title}
          onChange={(v) => update(["valueProps", "title"], v)}
        />
        {content.valueProps.items.map((item, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-3">
            <Field
              label={`Kartu ${i + 1} & Judul`}
              value={item.title}
              onChange={(v) =>
                updateArrayItem(["valueProps", "items"], i, "title", v)
              }
            />
            <Field
              label={`Kartu ${i + 1} & Deskripsi`}
              value={item.desc}
              onChange={(v) =>
                updateArrayItem(["valueProps", "items"], i, "desc", v)
              }
              textarea
            />
            {content.valueProps.items.length > 1 && (
              <AddRemove
                addLabel=""
                onAdd={() => {}}
                onRemove={() => removeArrayItem(["valueProps", "items"], i)}
              />
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Kartu"
          onAdd={() =>
            addArrayItem(["valueProps", "items"], {
              title: "Judul baru",
              desc: "Deskripsi baru",
            })
          }
        />
      </Section>

      {/* Katalog */}
      <Section
        title="Section Katalog Produk (heading)"
        onSave={() => saveSection("katalog", { katalog: content.katalog })}
        saving={savingMap.katalog}
        status={statusMap.katalog}>
        <Field
          label="Label kecil"
          value={content.katalog.eyebrow}
          onChange={(v) => update(["katalog", "eyebrow"], v)}
        />
        <Field
          label="Judul"
          value={content.katalog.title}
          onChange={(v) => update(["katalog", "title"], v)}
        />
        <Field
          label='Teks tombol "Lihat Semua"'
          value={content.katalog.linkLabel}
          onChange={(v) => update(["katalog", "linkLabel"], v)}
        />
        <p className="text-xs text-bark-300">
          Kategori & jumlah produk otomatis dari menu Produk. Gambar tiap
          kategori diatur di panel di bawah ini.
        </p>
      </Section>

      <CategoryImagesPanel token={token} />

      {/* Layanan */}
      <Section
        title="Section Layanan Periksa Mata"
        onSave={() => saveSection("layanan", { layanan: content.layanan })}
        saving={savingMap.layanan}
        status={statusMap.layanan}>
        <Field
          label="Label kecil"
          value={content.layanan.eyebrow}
          onChange={(v) => update(["layanan", "eyebrow"], v)}
        />
        <Field
          label="Judul"
          value={content.layanan.title}
          onChange={(v) => update(["layanan", "title"], v)}
          textarea
        />
        <Field
          label="Deskripsi"
          value={content.layanan.description}
          onChange={(v) => update(["layanan", "description"], v)}
          textarea
        />
        <p className="text-sm font-semibold text-bark-700 mb-2">
          Daftar poin (bullet)
        </p>
        {content.layanan.bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-sand rounded-xl px-3 py-2 text-sm"
              value={b}
              onChange={(e) =>
                setContent((prev) => {
                  const next = structuredClone(prev);
                  next.layanan.bullets[i] = e.target.value;
                  return next;
                })
              }
            />
            {content.layanan.bullets.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["layanan", "bullets"], i)}
                className="text-xs px-3 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Poin"
          onAdd={() => addArrayItem(["layanan", "bullets"], "Poin baru")}
        />
        <p className="text-sm font-semibold text-bark-700 mb-2 mt-4">
          Tombol CTA & WhatsApp
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Teks tombol CTA"
            value={content.layanan.ctaLabel}
            onChange={(v) => update(["layanan", "ctaLabel"], v)}
          />
          <Field
            label="Nomor WhatsApp tujuan"
            value={content.layanan.waNumber}
            onChange={(v) => update(["layanan", "waNumber"], v)}
            hint="Contoh: 6281234567890 (pakai kode negara 62, tanpa spasi/tanda +). Kosongkan untuk pakai nomor WA Footer."
          />
        </div>
        <Field
          label="Pesan otomatis WhatsApp"
          value={content.layanan.waMessage}
          onChange={(v) => update(["layanan", "waMessage"], v)}
          textarea
          hint="Pesan ini otomatis terisi saat pengunjung klik tombol dan chat WA terbuka."
        />

        <MediaField
          label="Gambar / video (sisi kanan section)"
          value={content.layanan.media}
          onChange={(v) => update(["layanan", "media"], v)}
          uploading={layananMediaUploading}
          onUploadFile={uploadLayananMedia}
        />
      </Section>

      {/* Tentang */}
      <Section
        title="Section Tentang Kami"
        onSave={() => saveSection("tentang", { tentang: content.tentang })}
        saving={savingMap.tentang}
        status={statusMap.tentang}>
        <Field
          label="Label kecil"
          value={content.tentang.eyebrow}
          onChange={(v) => update(["tentang", "eyebrow"], v)}
        />
        <Field
          label="Judul"
          value={content.tentang.title}
          onChange={(v) => update(["tentang", "title"], v)}
        />
        <Field
          label="Deskripsi"
          value={content.tentang.description}
          onChange={(v) => update(["tentang", "description"], v)}
          textarea
        />
        <p className="text-sm font-semibold text-bark-700 mb-2">
          Statistik (angka pencapaian)
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {content.tentang.stats.map((s, i) => (
            <div key={i} className="border border-sand rounded-xl p-3">
              <Field
                label="Angka"
                value={s.value}
                onChange={(v) =>
                  updateArrayItem(["tentang", "stats"], i, "value", v)
                }
              />
              <Field
                label="Label"
                value={s.label}
                onChange={(v) =>
                  updateArrayItem(["tentang", "stats"], i, "label", v)
                }
              />
              {content.tentang.stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(["tentang", "stats"], i)}
                  className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
        <AddRemove
          addLabel="Tambah Statistik"
          onAdd={() =>
            addArrayItem(["tentang", "stats"], {
              value: "0",
              label: "Label baru",
            })
          }
        />

        <MediaField
          label="Gambar / video (sisi kiri section)"
          value={content.tentang.media}
          onChange={(v) => update(["tentang", "media"], v)}
          uploading={tentangMediaUploading}
          onUploadFile={uploadTentangMedia}
        />
      </Section>

      {/* Slider Layanan Optik Kayumanis */}
      <Section
        title="Slider Layanan Optik Kayumanis"
        onSave={() =>
          saveSection("layananSlider", { layananSlider: content.layananSlider })
        }
        saving={savingMap.layananSlider}
        status={statusMap.layananSlider}>
        <Field
          label="Judul"
          value={content.layananSlider.title}
          onChange={(v) => update(["layananSlider", "title"], v)}
        />
        <Field
          label="Subjudul"
          value={content.layananSlider.subtitle}
          onChange={(v) => update(["layananSlider", "subtitle"], v)}
          textarea
        />
        {content.layananSlider.items.map((item, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-4">
            <p className="text-xs font-bold uppercase text-cinnamon-500 mb-3">
              Slide Layanan {i + 1}
            </p>
            <div className="flex items-center gap-4 mb-4">
              {item.image ? (
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-sand shrink-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateArrayItem(
                        ["layananSlider", "items"],
                        i,
                        "image",
                        "",
                      )
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center"
                    aria-label="Hapus gambar">
                    x
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-video rounded-lg border border-dashed border-sand flex items-center justify-center text-xs text-bark-300 shrink-0">
                  Belum ada
                </div>
              )}
              <label className="inline-flex items-center gap-2 border border-dashed border-sand rounded-xl px-4 py-2.5 text-sm text-bark-500 cursor-pointer hover:border-cinnamon-400 hover:text-cinnamon-600">
                <span>
                  {sliderUploading[`layananSlider-${i}`]
                    ? "Mengunggah..."
                    : item.image
                      ? "Ganti Gambar"
                      : "+ Upload Gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={sliderUploading[`layananSlider-${i}`]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadSliderImage("layananSlider", i, file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <Field
              label="Judul slide"
              value={item.title}
              onChange={(v) =>
                updateArrayItem(["layananSlider", "items"], i, "title", v)
              }
            />
            <Field
              label="Deskripsi slide"
              value={item.desc}
              onChange={(v) =>
                updateArrayItem(["layananSlider", "items"], i, "desc", v)
              }
              textarea
            />
            {content.layananSlider.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["layananSlider", "items"], i)}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus Slide
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Slide Layanan"
          onAdd={() =>
            addArrayItem(["layananSlider", "items"], {
              title: "Layanan baru",
              desc: "Deskripsi layanan baru",
              image: "",
            })
          }
        />
      </Section>

      {/* Slider Cabang Optik Kayumanis */}
      <Section
        title="Slider Cabang Optik Kayumanis"
        onSave={() => saveSection("cabang", { cabang: content.cabang })}
        saving={savingMap.cabang}
        status={statusMap.cabang}>
        <Field
          label="Judul"
          value={content.cabang.title}
          onChange={(v) => update(["cabang", "title"], v)}
        />
        <Field
          label="Subjudul"
          value={content.cabang.subtitle}
          onChange={(v) => update(["cabang", "subtitle"], v)}
          textarea
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Teks tombol CTA"
            value={content.cabang.ctaLabel}
            onChange={(v) => update(["cabang", "ctaLabel"], v)}
          />
          <Field
            label="URL tombol CTA"
            value={content.cabang.ctaHref}
            onChange={(v) => update(["cabang", "ctaHref"], v)}
            hint="Isi URL manual, misalnya link WhatsApp atau Google Maps."
          />
        </div>
        {content.cabang.items.map((item, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-4">
            <p className="text-xs font-bold uppercase text-cinnamon-500 mb-3">
              Slide Cabang {i + 1}
            </p>
            <div className="flex items-center gap-4 mb-4">
              {item.image ? (
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-sand shrink-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateArrayItem(["cabang", "items"], i, "image", "")
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center"
                    aria-label="Hapus gambar">
                    x
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-video rounded-lg border border-dashed border-sand flex items-center justify-center text-xs text-bark-300 shrink-0">
                  Belum ada
                </div>
              )}
              <label className="inline-flex items-center gap-2 border border-dashed border-sand rounded-xl px-4 py-2.5 text-sm text-bark-500 cursor-pointer hover:border-cinnamon-400 hover:text-cinnamon-600">
                <span>
                  {sliderUploading[`cabang-${i}`]
                    ? "Mengunggah..."
                    : item.image
                      ? "Ganti Gambar"
                      : "+ Upload Gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={sliderUploading[`cabang-${i}`]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadSliderImage("cabang", i, file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <Field
              label="Nama cabang"
              value={item.title}
              onChange={(v) =>
                updateArrayItem(["cabang", "items"], i, "title", v)
              }
            />
            <Field
              label="Deskripsi / alamat"
              value={item.desc}
              onChange={(v) =>
                updateArrayItem(["cabang", "items"], i, "desc", v)
              }
              textarea
            />
            {content.cabang.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["cabang", "items"], i)}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus Slide
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Slide Cabang"
          onAdd={() =>
            addArrayItem(["cabang", "items"], {
              title: "Cabang baru",
              desc: "Alamat cabang baru",
              image: "",
            })
          }
        />
      </Section>

      {/* Sponsor */}
      <Section
        title="Slider Sponsor"
        onSave={() => saveSection("sponsors", { sponsors: content.sponsors })}
        saving={savingMap.sponsors}
        status={statusMap.sponsors}>
        <Field
          label="Judul"
          value={content.sponsors.title}
          onChange={(v) => update(["sponsors", "title"], v)}
        />
        <Field
          label="Subjudul"
          value={content.sponsors.subtitle}
          onChange={(v) => update(["sponsors", "subtitle"], v)}
          textarea
        />
        {content.sponsors.items.map((item, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-4">
            <p className="text-xs font-bold uppercase text-cinnamon-500 mb-3">
              Sponsor {i + 1}
            </p>
            <div className="flex items-center gap-4 mb-4">
              {item.image ? (
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-sand shrink-0 bg-white">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateArrayItem(["sponsors", "items"], i, "image", "")
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-5 text-center"
                    aria-label="Hapus gambar">
                    x
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-video rounded-lg border border-dashed border-sand flex items-center justify-center text-xs text-bark-300 shrink-0">
                  Belum ada
                </div>
              )}
              <label className="inline-flex items-center gap-2 border border-dashed border-sand rounded-xl px-4 py-2.5 text-sm text-bark-500 cursor-pointer hover:border-cinnamon-400 hover:text-cinnamon-600">
                <span>
                  {sliderUploading[`sponsors-${i}`]
                    ? "Mengunggah..."
                    : item.image
                      ? "Ganti Foto"
                      : "+ Upload Foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={sliderUploading[`sponsors-${i}`]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadSliderImage("sponsors", i, file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <Field
              label="Nama sponsor"
              value={item.name || ""}
              onChange={(v) =>
                updateArrayItem(["sponsors", "items"], i, "name", v)
              }
            />
            {content.sponsors.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["sponsors", "items"], i)}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus Sponsor
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Foto Sponsor"
          onAdd={() =>
            addArrayItem(["sponsors", "items"], {
              name: "Sponsor baru",
              image: "",
            })
          }
        />
      </Section>

      {/* Kontak */}
      <Section
        title="Section Kontak"
        onSave={() => saveSection("kontak", { kontak: content.kontak })}
        saving={savingMap.kontak}
        status={statusMap.kontak}>
        <Field
          label="Judul"
          value={content.kontak.title}
          onChange={(v) => update(["kontak", "title"], v)}
        />
        <Field
          label="Subjudul"
          value={content.kontak.subtitle}
          onChange={(v) => update(["kontak", "subtitle"], v)}
          textarea
        />
        <MediaField
          label="Gambar di sisi kanan form"
          value={content.kontak.image}
          onChange={(v) => update(["kontak", "image"], v)}
          uploading={kontakImageUploading}
          onUploadFile={uploadKontakImage}
        />
      </Section>
      {/* Footer */}
      <Section
        title="Footer"
        onSave={() => saveSection("footer", { footer: content.footer })}
        saving={savingMap.footer}
        status={statusMap.footer}>
        <Field
          label="Deskripsi singkat toko"
          value={content.footer.description}
          onChange={(v) => update(["footer", "description"], v)}
          textarea
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Nomor WhatsApp (tampilan)"
            value={content.footer.whatsappDisplay}
            onChange={(v) => update(["footer", "whatsappDisplay"], v)}
          />
          <Field
            label="Link WhatsApp (wa.me/...)"
            value={content.footer.whatsappLink}
            onChange={(v) => update(["footer", "whatsappLink"], v)}
          />
          <Field
            label="Email"
            value={content.footer.email}
            onChange={(v) => update(["footer", "email"], v)}
          />
          <Field
            label="Alamat"
            value={content.footer.address}
            onChange={(v) => update(["footer", "address"], v)}
          />
        </div>
        <p className="text-sm font-semibold text-bark-700 mb-2 mt-4">
          Jam operasional
        </p>
        {content.footer.hours.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-sand rounded-xl px-3 py-2 text-sm"
              value={h}
              onChange={(e) =>
                setContent((prev) => {
                  const next = structuredClone(prev);
                  next.footer.hours[i] = e.target.value;
                  return next;
                })
              }
            />
            {content.footer.hours.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(["footer", "hours"], i)}
                className="text-xs px-3 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                Hapus
              </button>
            )}
          </div>
        ))}
        <AddRemove
          addLabel="Tambah Baris Jam"
          onAdd={() =>
            addArrayItem(["footer", "hours"], "Setiap Hari: 09.00 â€“ 20.00")
          }
        />

        <p className="text-sm font-semibold text-bark-700 mb-2 mt-4">
          Link Media Sosial
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field
            label="Instagram"
            value={content.footer.socials.instagram}
            onChange={(v) => update(["footer", "socials", "instagram"], v)}
            hint="Contoh: instagram.com/optikkayumanis"
          />
          <Field
            label="Facebook"
            value={content.footer.socials.facebook}
            onChange={(v) => update(["footer", "socials", "facebook"], v)}
            hint="Contoh: facebook.com/optikkayumanis"
          />
          <Field
            label="TikTok"
            value={content.footer.socials.tiktok}
            onChange={(v) => update(["footer", "socials", "tiktok"], v)}
            hint="Contoh: tiktok.com/@optikkayumanis"
          />
        </div>

        <p className="text-sm font-semibold text-bark-700 mb-2 mt-4">
          Lokasi Peta
        </p>
        <Field
          label="Alamat atau link sematkan Google Maps"
          value={content.footer.mapEmbed || ""}
          onChange={(v) => update(["footer", "mapEmbed"], v)}
          hint='Isi alamat toko (mis. "Optik Kayumanis, Jl. Kayumanis No 12, Bogor"), atau tempel link dari Google Maps â†’ Bagikan â†’ Sematkan peta â†’ salin src iframe-nya untuk kontrol titik lokasi yang presisi.'
        />

        <p className="text-sm font-semibold text-bark-700 mb-2 mt-4">
          Teks Hak Cipta (bawah footer)
        </p>
        <Field
          label="Teks setelah tahun"
          value={content.footer.copyrightText || ""}
          onChange={(v) => update(["footer", "copyrightText"], v)}
          hint='Tahun berjalan ditambahkan otomatis di depan. Contoh hasil: "Â© 2026 Optik Kayumanis. Seluruh hak cipta dilindungi."'
        />
      </Section>
    </div>
  );
}
