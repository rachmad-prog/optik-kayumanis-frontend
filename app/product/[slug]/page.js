import { notFound } from "next/navigation";
import { api, formatRupiah } from "../../../lib/api";
import AddToCartForm from "../../../components/AddToCartForm";
import ProductGallery from "../../../components/ProductGallery";

async function getProduct(slug) {
  try {
    const data = await api.get(`/products/${slug}`);
    return data.product;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const discounted = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-cinnamon-500 font-mono mb-2">
          {product.category?.name}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-bark-700 mb-4">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-mono text-2xl font-semibold text-cinnamon-600">
            {formatRupiah(product.price)}
          </span>
          {discounted && (
            <span className="font-mono text-base text-bark-300 line-through">
              {formatRupiah(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="text-bark-500 leading-relaxed mb-6">{product.description}</p>

        <dl className="grid grid-cols-2 gap-4 mb-8 text-sm">
          {product.frameShape && (
            <div>
              <dt className="text-bark-300 uppercase text-xs tracking-wide">Bentuk Frame</dt>
              <dd className="text-bark-700 font-medium">{product.frameShape}</dd>
            </div>
          )}
          {product.frameMaterial && (
            <div>
              <dt className="text-bark-300 uppercase text-xs tracking-wide">Material</dt>
              <dd className="text-bark-700 font-medium">{product.frameMaterial}</dd>
            </div>
          )}
          <div>
            <dt className="text-bark-300 uppercase text-xs tracking-wide">SKU</dt>
            <dd className="text-bark-700 font-mono">{product.sku}</dd>
          </div>
          <div>
            <dt className="text-bark-300 uppercase text-xs tracking-wide">Stok</dt>
            <dd className="text-bark-700 font-medium">
              {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
            </dd>
          </div>
        </dl>

        <AddToCartForm product={product} />
      </div>
    </div>
  );
}
