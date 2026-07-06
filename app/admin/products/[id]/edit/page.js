"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { api } from "../../../../../lib/api";
import ProductForm from "../../../../../components/ProductForm";

export default function EditProductPage({ params }) {
  const { token, loading } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      api
        .get(`/products/admin/id/${params.id}`, token)
        .then((data) => setProduct(data.product))
        .catch((err) => setError(err.message));
    }
  }, [token, params.id]);

  if (loading || (!product && !error)) {
    return <p className="text-bark-300 text-sm">Memuat produk...</p>;
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-bark-700 mb-6">Edit Produk</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
