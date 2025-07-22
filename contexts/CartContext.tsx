"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from "react";

interface Product {
  id: string | number;
  cart_count?: number;
  [key: string]: any;
}

interface CartContextType {
  cartProducts: Product[];
  updateProductInCart: (product: Product, count?: number) => void;
  updateProductsCount: (arrayOfIds: (string | number)[], changeValueNumberOrArray: number | number[]) => void;
  removeProductFromCart: (id: string | number) => void;
  updateProductCount: (id: (string | number), changeValue: number) => void;
  removeProductsFromCart: (arrayOfIds: (string | number)[], arrayOfChangeValues: (string | number)[]) => void;
  findProductInCart: (id: string | number) => Product | undefined;
  getIsProductInCart: (id: string | number) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

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

  const removeProductFromCart = (id: string | number) => {
    setCartProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const removeProductsFromCart = (arrayOfIds: (string | number)[]) => {
    setCartProducts((prev) => prev.filter((product) => !arrayOfIds.includes(product.id)));
  };

  const findProductInCart = (id: string | number): Product | undefined => {
    return cartProducts.find((product) => product.id === id);
  };

  const getIsProductInCart = (id: string | number): boolean => {
    return Boolean(findProductInCart(id));
  };

  const updateProductInCart = (product: Product, count: number = 1) => {
    if (count < 0) count = 1; 
    
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

  const updateProductCount = (id: string | number, changeValue: number) => {
    if (changeValue === 0) changeValue = 1;
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

  const updateProductsCount = (arrayOfIds: (string | number)[], changeValueNumberOrArray: number | number[]) => {
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
        updateProductCount,
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

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("This hook can't be used outside a provider");
  return ctx;
}