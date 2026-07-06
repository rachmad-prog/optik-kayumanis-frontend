import { api } from "../../lib/api";
import ProductCard from "../../components/ProductCard";

async function getProducts(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.q) params.set("q", searchParams.q);
  params.set("limit", "24");

  try {
    const data = await api.get(`/products?${params.toString()}`);
    return data.items;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const data = await api.get("/categories");
    return data.items;
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
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-bark-700 mb-2">
        Semua Produk
      </h1>
      <p className="text-bark-500 mb-8">Temukan kacamata yang cocok dengan gayamu.</p>

      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm border ${
            !searchParams.category
              ? "bg-cinnamon-500 text-white border-cinnamon-500"
              : "border-sand text-bark-500 hover:border-cinnamon-300"
          }`}
        >
          Semua
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm border ${
              searchParams.category === cat.slug
                ? "bg-cinnamon-500 text-white border-cinnamon-500"
                : "border-sand text-bark-500 hover:border-cinnamon-300"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-xl text-bark-500 mb-2">Belum ada produk di sini.</p>
          <p className="text-bark-300 text-sm">Coba kategori lain atau kembali lagi nanti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
