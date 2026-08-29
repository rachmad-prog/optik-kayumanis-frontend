"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-bark-700 mb-2">Daftar Akun</h1>
      <p className="text-bark-500 mb-8">Buat akun baru untuk mulai belanja di Optik Kayumanis.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-bark-500 mb-1">Nama Lengkap</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Nomor HP</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-bark-500 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border border-sand rounded-xl pl-4 pr-11 py-3 focus:border-cinnamon-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bark-400 hover:text-bark-600 p-1"
              title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>


        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-cinnamon-500 text-white font-medium py-3 rounded-full hover:bg-cinnamon-600 disabled:opacity-50"
        >
          {submitting ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-sm text-bark-500 mt-6 text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-cinnamon-600 font-medium">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
