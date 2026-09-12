import { api } from "../lib/api";

const SITE_URL = (process.env.NEXT_PUBLIC_CLIENT_URL || "https://optikkayumanis.id").replace(/\/$/, "");

// Halaman statis yang mau dimasukkan ke sitemap.
const STATIC_ROUTES = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/articles", changeFrequency: "daily", priority: 0.8 },
];

// Ambil semua artikel yang sudah published, looping tiap halaman (max limit API = 50/halaman).
// Dibatasi sampai 20 halaman (≈1000 artikel) untuk jaga-jaga supaya tidak infinite loop.
async function getAllArticles() {
  const results = [];
  let page = 1;
  const MAX_PAGES = 20;

  while (page <= MAX_PAGES) {
    try {
      const data = await api.get(`/articles?page=${page}&limit=50`, null, {
        next: { revalidate: 3600 },
      });
      const items = data.items || [];
      results.push(...items);
      if (page >= (data.totalPages || 1)) break;
      page += 1;
    } catch (err) {
      console.error("[sitemap] Gagal fetch artikel:", err?.message);
      break;
    }
  }

  return results;
}

// Ambil semua produk aktif, looping tiap halaman.
async function getAllProducts() {
  const results = [];
  let page = 1;
  const MAX_PAGES = 20;

  while (page <= MAX_PAGES) {
    try {
      const data = await api.get(`/products?page=${page}&limit=50`, null, {
        next: { revalidate: 3600 },
      });
      const items = data.items || [];
      results.push(...items);
      if (page >= (data.totalPages || 1)) break;
      page += 1;
    } catch (err) {
      console.error("[sitemap] Gagal fetch produk:", err?.message);
      break;
    }
  }

  return results;
}

export default async function sitemap() {
  const [articles, products] = await Promise.all([getAllArticles(), getAllProducts()]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries = articles
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt || a.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const productEntries = products
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt || p.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticEntries, ...articleEntries, ...productEntries];
}
