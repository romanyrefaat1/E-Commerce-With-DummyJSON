"use client";

import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import {Suspense} from "react"

export default function ProductPage() {
  const { id } = useParams();
  const {
    updateProductInCart,
    removeProductFromCart,
    findProductInCart,
    getIsProductInCart,
  } = useCart();
  const { getProductDataByProductId, loading, error } = useProducts();
  const [productData, setProductData] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      const {data, error} = await getProductDataByProductId(id);
      console.log(data)

      if (!data.id) {
        console.warn("Fetched product data is missing an id:", data);
      }
      setProductData(data);
    };
    fetchProducts();
  }, [id]);

  const isProductInCart = getIsProductInCart(id);

  // Initialize count from productData.cart_count or 0
  const [count, setCount] = useQueryState("count", {
    parse: Number,
    defaultValue: productData?.cart_count ? Number(productData.cart_count) : 0,
  });

  // Keep count in sync when productData updates
  useEffect(() => {
    if (productData?.cart_count) {
      setCount(Number(productData.cart_count));
    }
  }, [productData]);

  // Handle loading and error states
  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  if (!productData) {
    return <div>Product not found</div>;
  }

  return (
    <Suspense>
    <div>
      <h2>Product: {productData.title}</h2>

      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => setCount((prev) => Math.max(prev - 1, 0))}>
          Decrease Count
        </button>
        <span style={{ margin: "0 1rem" }}>{count}</span>
        <button onClick={() => setCount((prev) => prev + 1)}>
          Increase Count
        </button>
      </div>

      {isProductInCart ? (
        <button onClick={() => removeProductFromCart(id)}>
          Remove {productData.cart_count ?? count} item(s) from cart
        </button>
      ) : (
        <button onClick={() => {
          if (!productData.id) {
            console.error("Trying to add product with missing ID:", productData);
            return;
          }
          let endCount = count;
          if (endCount < 1) {
            console.log("detected count < 1")
            endCount = 1
            setCount(1)
          }
          updateProductInCart(productData, endCount);
        }}>
          Add To Cart
        </button>
      )}

      <Link href={`/checkout?productId=${id}`}>Buy Now</Link>

      <pre style={{ marginTop: "1rem" }}>{JSON.stringify(productData, null, 2)}</pre>
    </div>
    </Suspense>
  );
}