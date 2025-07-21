"use client";

import { useState, useEffect, useContext, createContext } from "react";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("cart_products");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartProducts(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cart_products from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    console.log("cartProducts:", cartProducts);
    window.localStorage.setItem("cart_products", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const removeProductFromCart = (id) => {
    setCartProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const removeProductsFromCart = (arrayOfIds) => {
    setCartProducts((prev) => prev.filter((product) => !arrayOfIds.includes(product.id)));
  };

  const findProductInCart = (id) => {
    return cartProducts.find((product) => product.id === id);
  };

  const getIsProductInCart = (id) => {
    return Boolean(findProductInCart(id));
  };

  const updateProductInCart = (product, count = 1) => {
    if (count < 0) count =1; 
    
    setCartProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, cart_count: count } : p
        );
      } else {
        return [...prev, { ...product, cart_count: count }];
      }
    });
  };

  const updateProductCount = (id, changeValue) => {
    if (changeValue === 0) changeValue=1;
    setCartProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              cart_count: (product.cart_count || 0) + Number(changeValue),
            }
          : product
      )
    );
  };

  const updateProductsCount = (arrayOfIds, changeValueNumberOrArray) => {
    if (typeof changeValueNumberOrArray === "number") {
      arrayOfIds.forEach((productId) => updateProductCount(productId, changeValueNumberOrArray));
    } else if (Array.isArray(changeValueNumberOrArray)) {
      arrayOfIds.forEach((productId, index) => {
        updateProductCount(productId, changeValueNumberOrArray[index] || 0);
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        updateProductInCart,
        updateProductsCount,
        removeProductFromCart,
        removeProductsFromCart,
        findProductInCart,
        getIsProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("This hook can't be used outside a provider");
  return ctx;
}
