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
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-sand rounded-xl px-4 py-3 focus:border-cinnamon-400 outline-none"
          />
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
