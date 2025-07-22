"use client";

import { useCheckout } from "@/contexts/CheckouContext";
import CheckoutButton from "./_components/checkout-button";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage({ params }) {
  const { productId } = params;
  const { productsToCheckout, setProductsToCheckout } = useCheckout();
  // const { getProductsDataByProductsIds } = useProducts();
  const {findProductInCart} = useCart()
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      const data = findProductInCart(productId)
      if (!data) {
        setError("No product found");
        return;
      }
      setProductsToCheckout([data]); // TODO: Romany, you must get the data of the product first
    }
  }, [productId, setProductsToCheckout]);

  useEffect(()=> console.log("productsToCheckout", productsToCheckout),[productsToCheckout])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!Array.isArray(productsToCheckout) || productsToCheckout.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <button onClick={()=> syncProducts()}>Sync dodo and dummyjson apis</button>
      <h1>Checkout your products</h1>
      <p>Here are the products you are about to buy:</p>
      <div>
        {productsToCheckout.map((product) => (
          <div key={product.id}>
            <img src={product.images?.[0] || ""} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
      <CheckoutButton products={productsToCheckout} />
    </div>
  );
}
