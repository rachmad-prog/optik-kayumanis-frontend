"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

// Banner peringatan yang tampil di semua halaman admin kalau masa aktif lisensi sudah habis.
// Ini TIDAK memblokir akses ADMIN/DIREKTUR ke fitur admin — cuma pengingat visual,
// karena pemblokiran akses publik (produk, gambar, dll) sudah ditangani middleware checkLicense di backend.
export default function LicenseBanner({ token, role, onOpenLicenseModal }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .get("/license/status", token)
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [token]);

  if (!status || !status.isExpired) return null;

  const tanggal = status.expiredAt
    ? new Date(status.expiredAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-sm mb-0.5">
          ⚠️ Masa aktif lisensi website telah habis ({tanggal})
        </p>
        <p className="text-xs text-red-600/90">
          Akses publik (produk, gambar, dll) sudah otomatis diblokir untuk pengunjung. Panel
          admin ini tetap bisa Anda gunakan seperti biasa.
        </p>
      </div>
      {role === "DIREKTUR" && (
        <button
          onClick={onOpenLicenseModal}
          className="shrink-0 px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors">
          Perbarui Sekarang
        </button>
      )}
    </div>
  );
}
