"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { DEFAULT_CONTENT } from "../../../lib/defaultContent";

function Field({ label, value, onChange, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-bark-700 mb-1">
        {label}
      </span>
      {hint && <span className="block text-xs text-bark-300 mb-1">{hint}</span>}
      <input
        className="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cinnamon-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function AdminBankAccountsPage() {
  const { token } = useAuth();
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get("/content")
      .then((data) => setContent({ ...DEFAULT_CONTENT, ...data.content }))
      .catch(() => setContent(DEFAULT_CONTENT));
  }, []);

  function updateBank(index, key, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next.bankAccounts[index][key] = value;
      return next;
    });
  }

  function addBank() {
    setContent((prev) => {
      const next = structuredClone(prev);
      next.bankAccounts = next.bankAccounts || [];
      next.bankAccounts.push({
        bankName: "Bank BCA",
        accountNumber: "0000000000",
        accountName: "Optik Kayumanis",
      });
      return next;
    });
  }

  function removeBank(index) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next.bankAccounts.splice(index, 1);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/content", { bankAccounts: content.bankAccounts || [] }, token);
      setStatus({
        ok: true,
        message: "Tersimpan! Perubahan langsung tampil di halaman utama.",
      });
    } catch (err) {
      setStatus({ ok: false, message: err.message || "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  }

  if (!content)
    return <p className="text-bark-300 text-sm">Memuat data...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-bark-700">
          Rekening Bank
        </h1>
        <p className="text-sm text-bark-300 mt-1">
          Kelola rekening bank tujuan transfer pelanggan untuk transaksi pembayaran pesanan.
        </p>
      </div>

      <div className="bg-white border border-sand rounded-2xl p-6">
        {(content.bankAccounts || []).map((bank, i) => (
          <div key={i} className="border border-sand rounded-xl p-4 mb-4 bg-slate-50">
            <p className="text-xs font-bold uppercase text-cinnamon-600 mb-3">
              Rekening Bank {i + 1}
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field
                label="Nama Bank"
                value={bank.bankName}
                onChange={(v) => updateBank(i, "bankName", v)}
                hint="Contoh: Bank BCA, Mandiri, BRI, BNI"
              />
              <Field
                label="Nomor Rekening"
                value={bank.accountNumber}
                onChange={(v) => updateBank(i, "accountNumber", v)}
                hint="Contoh: 1234567890"
              />
              <Field
                label="Atas Nama (Pemilik)"
                value={bank.accountName}
                onChange={(v) => updateBank(i, "accountName", v)}
                hint="Contoh: Optik Kayumanis"
              />
            </div>
            {(content.bankAccounts || []).length > 1 && (
              <button
                type="button"
                onClick={() => removeBank(i)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 mt-2">
                Hapus Rekening Ini
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addBank}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-cinnamon-300 text-cinnamon-600 hover:bg-cinnamon-50">
          + Tambah Rekening Bank Baru
        </button>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-sand">
          {status && (
            <p className={`text-xs ${status.ok ? "text-cinnamon-600" : "text-red-500"}`}>
              {status.message}
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 bg-cinnamon-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-cinnamon-600 disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
