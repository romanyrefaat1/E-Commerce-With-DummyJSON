"use client";

import debounce from "@/lib/debounce";
import { useCallback, useEffect, useContext, useState, createContext } from "react";
import { useCategories } from "./CategoriesContext";

const ProductsContext = createContext(null);

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productsByCategoryName, setProductsByCategoryName] = useState(null);
  const [errorProductsByCategoryName, setErrorProductsByCategoryName] = useState(null);
  const [loadingProductsByCategoryName, setLoadingProductsByCategoryName] = useState(false);

  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loadingSearchedProducts, setLoadingSearchedProducts] = useState(false);
  const [errorSearchedProducts, setErrorSearchedProducts] = useState(null);

  const { categoryName } = useCategories();

  const refetch = async (limit = 15) => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=" + limit);
      const data = await response.json();
      if (!data) setError(`Request Returned a false response: ${data}`);

      setProducts(data.products || []);
    } catch (err) {
      setError(`An Unknown error happened: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setLoadingSearchedProducts(true);
      try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        const data = await response.json();

        if (!data) setErrorSearchedProducts(`Request Returned a false response: ${data}`);

        setSearchedProducts(data.products || []);
      } catch (err) {
        setErrorSearchedProducts(`An Unknown error happened: ${err}`);
      } finally {
        setLoadingSearchedProducts(false);
      }
    }, 300),
    []
  );

  const searchProducts = (query) => {
    debouncedSearch(query);
  };

  const updateProductsByCategoryName = async (category, isSetMainProductsArray = false) => {
    if (isSetMainProductsArray) {
      setLoading(true);
    } else {
      setLoadingProductsByCategoryName(true);
    }

    try {
      const response = await fetch("https://dummyjson.com/products/category/" + category);
      const data = await response.json();
      if (!data) setError(`Request Returned a false response: ${data}`);

      const productsArray = data.products || [];
      if (isSetMainProductsArray) {
        setProducts(productsArray);
      } else {
        setProductsByCategoryName(productsArray);
      }
    } catch (err) {
      if (isSetMainProductsArray) {
        setError(`An Unknown error happened: ${err}`);
      } else {
        setErrorProductsByCategoryName(`An Unknown error happened: ${err}`);
      }
    } finally {
      if (isSetMainProductsArray) {
        setLoading(false);
      } else {
        setLoadingProductsByCategoryName(false);
      }
    }
  };

  useEffect(() => {
    if (typeof categoryName !== "string") return;
    updateProductsByCategoryName(categoryName, true);
  }, [categoryName]);

  const getProductDataByProductId = async (id) => {
    if (!id) return { error: "No ID provided" };
  
    const productId = Number(id);
    if (isNaN(productId)) return { error: "Invalid ID format" };
  
    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      if (!response.ok) {
        return { error: `Error fetching product data: ${response.status}` };
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: `Unknown error fetching product data: ${error.message}` };
    }
  };

  const getProductsDataByProductsIds = async (arrayOfIds) => {
    if (!Array.isArray(arrayOfIds) || arrayOfIds.length === 0) return { data: [], error: null };

    try {
      const results = await Promise.all(
        arrayOfIds.map((id) => getProductDataByProductId(id))
      );
      const validProducts = results.filter((result) => result.data && !result.error).map((r) => r.data);
      return { data: validProducts, error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refetch,

        searchedProducts,
        loadingSearchedProducts,
        errorSearchedProducts,
        searchProducts,

        productsByCategoryName,
        errorProductsByCategoryName,
        loadingProductsByCategoryName,
        updateProductsByCategoryName,

        getProductDataByProductId,
        getProductsDataByProductsIds,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("This hook can't be used outside a provider");
  return ctx;
}
