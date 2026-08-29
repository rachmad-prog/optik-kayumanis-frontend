import { api } from "../../lib/api";
import ShopCatalogContainer from "../../components/ShopCatalogContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.q) params.set("q", searchParams.q);
  params.set("limit", "48");

  try {
    const data = await api.get(`/products?${params.toString()}`, null, { cache: "no-store" });
    return data.items || [];
  } catch {
    return [];
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

export default async function ShopPage({ searchParams }) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      <ShopCatalogContainer
        initialProducts={products}
        categories={categories}
        currentCategory={searchParams.category}
        initialQuery={searchParams.q}
      />
    </div>
  );
}
