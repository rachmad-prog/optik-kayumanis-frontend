export const metadata = {
  title: "Website Sedang Tidak Aktif — Optik Kayumanis",
};

export default function LicenseExpiredPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cinnamon/10 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-cinnamon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mb-3">
        Website Sedang Tidak Aktif
      </h1>
      <p className="text-warmgray max-w-md mx-auto">
        Mohon maaf, layanan website ini untuk sementara tidak dapat diakses.
        Tim kami sedang memperbarui masa aktif operasional. Silakan coba
        beberapa saat lagi.
      </p>
    </div>
  );
}
