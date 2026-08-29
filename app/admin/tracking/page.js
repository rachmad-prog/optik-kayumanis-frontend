"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";

function Field({ label, hint, value, onChange, placeholder }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-bark-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-bark-300 mb-1.5">{hint}</p>}
      <input
        className="w-full border border-sand rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-cinnamon-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function AdminTrackingPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    metaPixelId: "",
    googleAdsId: "",
    googleAdsLabel: "",
    gtmId: "",
    gaId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Guard: hanya DIREKTUR yang bisa akses
  useEffect(() => {
    if (!authLoading && user && user.role !== "DIREKTUR") {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!token) return;
    api
      .get("/tracking", token)
      .then((data) => {
        const t = data.tracking || {};
        setForm({
          metaPixelId:    t.metaPixelId    || "",
          googleAdsId:    t.googleAdsId    || "",
          googleAdsLabel: t.googleAdsLabel || "",
          gtmId:          t.gtmId          || "",
          gaId:           t.gaId           || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/tracking", {
        metaPixelId:    form.metaPixelId    || null,
        googleAdsId:    form.googleAdsId    || null,
        googleAdsLabel: form.googleAdsLabel || null,
        gtmId:          form.gtmId          || null,
        gaId:           form.gaId           || null,
      }, token);
      setStatus({ ok: true, message: "Pengaturan tracking berhasil disimpan." });
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setSaving(false);
    }
  }

  // Render kosong selama cek auth
  if (authLoading || !user) return null;
  if (user.role !== "DIREKTUR") return null;

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700 mb-1">Tracking &amp; Pixel</h1>
        <p className="text-sm text-bark-400">
          Isi ID pixel dan tag iklan di bawah. Script akan otomatis ter-inject ke semua halaman publik website.
          Kosongkan field jika tidak digunakan.
        </p>
      </div>

      {loading ? (
        <p className="text-bark-300 text-sm">Memuat pengaturan...</p>
      ) : (
        <form onSubmit={handleSave}>
          <div className="bg-white border border-sand rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-bark-700 mb-4 flex items-center gap-2">
              <span className="text-blue-600">f</span> Meta Ads (Facebook Pixel)
            </h2>
            <Field
              label="Meta Pixel ID"
              hint="Temukan di Meta Ads Manager > Events Manager. Format: 15–16 digit angka."
              value={form.metaPixelId}
              onChange={(v) => setField("metaPixelId", v)}
              placeholder="123456789012345"
            />
          </div>

          <div className="bg-white border border-sand rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-bark-700 mb-4 flex items-center gap-2">
              <span className="text-green-600">G</span> Google Tag Manager
            </h2>
            <Field
              label="GTM Container ID"
              hint="Temukan di tagmanager.google.com. Format: GTM-XXXXXX."
              value={form.gtmId}
              onChange={(v) => setField("gtmId", v)}
              placeholder="GTM-ABCDEF"
            />
            <p className="text-xs text-bark-300 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Jika menggunakan GTM, Anda bisa mengkonfigurasi Google Ads dan GA4 dari dalam GTM. Field di bawah untuk injeksi langsung (tanpa GTM).
            </p>
          </div>

          <div className="bg-white border border-sand rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-bark-700 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">G</span> Google Analytics 4
            </h2>
            <Field
              label="GA4 Measurement ID"
              hint="Temukan di Google Analytics > Admin > Data Streams. Format: G-XXXXXXXXXX."
              value={form.gaId}
              onChange={(v) => setField("gaId", v)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="bg-white border border-sand rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-bark-700 mb-4 flex items-center gap-2">
              <span className="text-blue-500">G</span> Google Ads
            </h2>
            <Field
              label="Google Ads Conversion ID"
              hint="Temukan di Google Ads > Tools > Conversions. Format: AW-XXXXXXXXX."
              value={form.googleAdsId}
              onChange={(v) => setField("googleAdsId", v)}
              placeholder="AW-123456789"
            />
            <Field
              label="Google Ads Conversion Label"
              hint="Label konversi spesifik yang ditrack. Temukan di halaman Conversion Detail."
              value={form.googleAdsLabel}
              onChange={(v) => setField("googleAdsLabel", v)}
              placeholder="AbCdEfGhIjKlMnOp"
            />
          </div>

          {status && (
            <div className={`text-sm rounded-xl px-4 py-3 mb-4 ${status.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-cinnamon-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-cinnamon-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      )}
    </div>
  );
}