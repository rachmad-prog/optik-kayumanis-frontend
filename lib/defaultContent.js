// Mirrors backend DEFAULT_CONTENT (src/controllers/content.controller.js) so the
// homepage still renders sensible copy even if the /content request fails.
export const DEFAULT_CONTENT = {
  hero: {
    topbarLeft: "Periksa Mata Gratis di Setiap Pembelian Frame + Lensa",
    topbarRight: "Buka Setiap Hari Â· 09.00 â€“ 20.00 WIB",
    slides: [
      {
        image: "",
        tag: "Koleksi Terbaru 2026",
        title: "Lihat Dunia Lebih Jernih, Tampil Lebih Percaya Diri",
        desc: "Frame premium, lensa berkualitas, dan pemeriksaan mata akurat â€” semua dalam satu tempat terpercaya untuk keluarga Anda.",
        ctaPrimaryLabel: "Lihat Koleksi",
        ctaPrimaryHref: "/shop",
        ctaSecondaryLabel: "Jadwalkan Periksa Mata",
        ctaSecondaryHref: "#layanan",
      },
      {
        image: "",
        tag: "Promo Bulan Ini",
        title: "Gratis Lensa Anti Radiasi untuk Pembelian Frame Pilihan",
        desc: "Nikmati penglihatan nyaman sepanjang hari dengan lensa berkualitas tinggi dari mitra terpercaya kami.",
        ctaPrimaryLabel: "Lihat Koleksi",
        ctaPrimaryHref: "/shop",
        ctaSecondaryLabel: "",
        ctaSecondaryHref: "",
      },
      {
        image: "",
        tag: "Layanan Klinis",
        title: "Periksa Mata Akurat Bersama Optometris Berpengalaman",
        desc: "Pemeriksaan refraksi komputerisasi untuk hasil resep kacamata yang tepat.",
        ctaPrimaryLabel: "Jadwalkan Periksa Mata",
        ctaPrimaryHref: "#layanan",
        ctaSecondaryLabel: "",
        ctaSecondaryHref: "",
      },
    ],
  },
  marquee: [
    "â˜… Lensa Premium Bergaransi",
    "Pemeriksaan Refraksi Akurat",
    "Garansi Frame Resmi",
    "Konsultasi via WhatsApp",
  ],
  valueProps: {
    eyebrow: "Kenapa Optik Kayumanis",
    title: "Kepercayaan yang Terlihat dari Setiap Detail",
    items: [
      { title: "Lensa Premium", desc: "Bekerja sama dengan brand lensa terpercaya untuk hasil optimal dan tahan lama." },
      { title: "Pemeriksaan Komputer Akurat", desc: "Alat refraksi digital untuk resep kacamata yang presisi sesuai kondisi mata Anda." },
      { title: "Garansi Frame", desc: "Setiap pembelian frame dilengkapi garansi resmi dan layanan purna jual." },
      { title: "Konsultasi Cepat", desc: "Tim kami siap membantu lewat WhatsApp untuk rekomendasi dan pemesanan." },
    ],
  },
  katalog: {
    eyebrow: "Katalog Produk",
    title: "Temukan Gaya yang Cocok untuk Anda",
    linkLabel: "Lihat Semua Produk",
  },
  layanan: {
    eyebrow: "Layanan Spesial",
    title: "Periksa Mata Refraksi Klinis, Gratis untuk Setiap Pembelian",
    description:
      "Optometris berpengalaman kami menggunakan alat digital modern untuk mengukur kondisi mata Anda secara akurat â€” mulai dari minus, silinder, hingga plus. Hasil pemeriksaan langsung digunakan untuk merekomendasikan lensa yang paling sesuai.",
    bullets: [
      "Pemeriksaan refraksi komputerisasi",
      "Konsultasi pemilihan lensa sesuai aktivitas",
      "Estimasi waktu pemeriksaan 15â€“20 menit",
    ],
    ctaLabel: "Jadwalkan via WhatsApp",
    media: "", // image or video URL shown on the right side of the section
  },
  tentang: {
    eyebrow: "Tentang Kami",
    title: "Optik Terpercaya untuk Keluarga Indonesia",
    description:
      "Optik Kayumanis hadir untuk memberikan pengalaman berbelanja kacamata yang hangat, personal, dan profesional â€” menggabungkan kualitas produk premium dengan pelayanan pemeriksaan mata yang akurat.",
    stats: [
      { value: "10+", label: "Tahun Berpengalaman" },
      { value: "15K+", label: "Pelanggan Puas" },
      { value: "50+", label: "Merek Frame" },
    ],
    media: "",
  },
  layananSlider: {
    title: "Layanan Optik Kayumanis",
    subtitle: "Pilih layanan optik yang nyaman untuk kebutuhan mata keluarga Anda.",
    items: [
      {
        title: "Pemeriksaan Mata",
        desc: "Pemeriksaan refraksi dan konsultasi pemilihan lensa bersama tim Optik Kayumanis.",
        image: "",
      },
      {
        title: "Konsultasi Lensa",
        desc: "Rekomendasi lensa sesuai aktivitas harian, pekerjaan, dan kebutuhan visual Anda.",
        image: "",
      },
    ],
  },
  cabang: {
    title: "Cabang Optik Kayumanis",
    subtitle: "Kunjungi cabang Optik Kayumanis terdekat dan dapatkan layanan terbaik kami.",
    ctaLabel: "Hubungi Cabang",
    ctaHref: "https://wa.me/6281234567890",
    items: [
      {
        title: "Optik Kayumanis Bogor",
        desc: "Jl. Kayumanis No. 12, Bogor, Jawa Barat.",
        image: "",
      },
    ],
  },
  sponsors: {
    title: "Sponsor & Partner",
    subtitle: "Didukung oleh partner pilihan Optik Kayumanis.",
    items: [
      { name: "Partner 1", image: "" },
      { name: "Partner 2", image: "" },
      { name: "Partner 3", image: "" },
    ],
  },
  kontak: {
    title: "Kontak Optik Kayumanis",
    subtitle: "Kirim pertanyaan Anda, tim kami akan membantu secepatnya.",
    image: "",
  },
  footer: {
    description: "Kacamata & lensa kontak premium, dengan layanan periksa mata profesional.",
    whatsappDisplay: "0812-3456-7890",
    whatsappLink: "https://wa.me/6281234567890",
    email: "halo@optikkayumanis.com",
    address: "Jl. Kayumanis No. 12, Bogor, Jawa Barat",
    hours: ["Senin â€“ Jumat: 09.00 â€“ 20.00", "Sabtu â€“ Minggu: 10.00 â€“ 18.00"],
    socials: { instagram: "#", facebook: "#", tiktok: "#" },
    mapEmbed: "",
    copyrightText: "Optik Kayumanis. Seluruh hak cipta dilindungi.",
  },
};

