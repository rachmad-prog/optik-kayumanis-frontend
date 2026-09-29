import { api } from "../../lib/api";
import ShopCatalogContainer from "../../components/ShopCatalogContainer";
import { DEFAULT_CONTENT } from "../../lib/defaultContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Mengembalikan { items, error } supaya kegagalan API (mis. lisensi diblokir,
// backend down) tidak lagi disamarkan menjadi "produk kosong".
async function getProducts(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.q) params.set("q", searchParams.q);
  params.set("limit", "48");

  try {
    const data = await api.get(`/products?${params.toString()}`, null, { cache: "no-store" });
    return { items: data.items || [], error: null };
  } catch (err) {
    console.error("[shop] Gagal memuat produk:", err?.message || err);
    return { items: [], error: err?.message || "Gagal memuat produk." };
  }
}

async function getCategories() {
  try {
    const data = await api.get("/categories", null, { cache: "no-store" });
    return data.items || [];
  } catch {
    return [];
  }
}

async function getContent() {
  try {
    const data = await api.get("/content", null, { cache: "no-store" });
    return data.content || DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export default async function ShopPage({ searchParams }) {
  const [{ items: products, error: loadError }, categories, content] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getContent(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      <ShopCatalogContainer
        initialProducts={products}
        categories={categories}
        currentCategory={searchParams.category}
        initialQuery={searchParams.q}
        loadError={loadError}
        storeSlides={content?.storeSlides}
      />
    </div>
  );
}
