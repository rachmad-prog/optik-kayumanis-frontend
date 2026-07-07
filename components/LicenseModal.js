"use client";

import { useState } from "react";
import { api } from "../lib/api";

// Modal aktivasi/perpanjangan lisensi website — khusus DIREKTUR.
// Alur: 1) Generate Token -> backend membuat token acak otomatis & simpan hash-nya di DB
//       (tidak perlu edit .env sama sekali). 2) Token itu berlaku singkat & sekali pakai.
//       3) Pilih tanggal/jam batas aktif baru, lalu "Perbarui Lisensi".
export default function LicenseModal({ open, onClose, token, onSuccess }) {
  const [generatedToken, setGeneratedToken] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genInfo, setGenInfo] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const reset = () => {
    setGeneratedToken("");
    setGenInfo("");
    setDurationInput("");
    setErrorMessage("");
    setCopied(false);
  };

  const handleGenerateToken = async () => {
    setGenLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post("/license/generate-token", {}, token);
      setGeneratedToken(res.token);
      setGenInfo(`Berlaku ${res.validForMinutes} menit, hanya bisa dipakai sekali.`);
      setCopied(false);
    } catch (err) {
      setErrorMessage(err.message || "Gagal membuat token baru.");
    } finally {
      setGenLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API bisa gagal di beberapa browser/permission — abaikan saja, token tetap terlihat di layar.
    }
  };

  const handleActivate = async () => {
    if (!generatedToken || !durationInput) {
      setErrorMessage("Generate token dan pilih batas waktu terlebih dahulu.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post(
        "/license/activate",
        { inputToken: generatedToken, customExpiredAt: durationInput },
        token,
      );
      alert(res.message || "Lisensi berhasil diperbarui!");
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err.message || "Gagal memperbarui lisensi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-sand text-bark-700">
        <h3 className="text-lg font-display font-semibold mb-1">
          Aktivasi Lisensi Website
        </h3>
        <p className="text-xs text-bark-400 mb-4">
          Generate token otomatis, lalu tentukan batas waktu aktif website baru.
        </p>

        {/* LANGKAH 1: GENERATE TOKEN OTOMATIS */}
        <div className="mb-4 bg-sand/20 border border-sand p-3 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-bark-600">
              1. Token Konfirmasi
            </label>
            <button
              type="button"
              onClick={handleGenerateToken}
              disabled={genLoading}
              className="px-3 py-1 bg-bark-700 text-white rounded-lg text-xs font-medium hover:bg-bark-600 transition-colors disabled:opacity-50">
              {genLoading ? "Membuat..." : "Generate Token"}
            </button>
          </div>

          {generatedToken ? (
            <>
              <div
                onClick={handleCopy}
                title="Klik untuk menyalin"
                className="bg-white border border-sand/60 p-2 rounded-lg font-mono text-[11px] text-bark-700 break-all cursor-pointer select-all">
                {generatedToken}
              </div>
              <p className="text-[10px] text-bark-400 mt-1">
                {copied ? "✅ Tersalin!" : genInfo}
              </p>
            </>
          ) : (
            <p className="text-[10px] text-bark-400">
              Klik tombol di atas untuk membuat token baru secara otomatis.
            </p>
          )}
        </div>

        {/* LANGKAH 2: PILIH BATAS WAKTU */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-bark-600 mb-1">
            2. Batas Waktu Aktif Website Baru
          </label>
          <input
            type="datetime-local"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            className="w-full p-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:border-cinnamon-600 bg-sand/20 text-bark-700"
            disabled={loading}
          />
        </div>

        {errorMessage && (
          <p className="text-xs font-medium text-red-600 mb-3 bg-red-50 p-2 rounded-xl">
            ⚠️ {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-4 py-2 text-bark-500 rounded-xl text-sm font-medium hover:bg-sand/30 transition-colors"
            disabled={loading}>
            Batal
          </button>
          <button
            onClick={handleActivate}
            className="px-4 py-2 bg-cinnamon-600 text-white rounded-xl text-sm font-medium hover:bg-cinnamon-700 transition-colors disabled:bg-cinnamon-300"
            disabled={loading || !generatedToken || !durationInput}>
            {loading ? "Memproses..." : "Perbarui Lisensi"}
          </button>
        </div>
      </div>
    </div>
  );
}
