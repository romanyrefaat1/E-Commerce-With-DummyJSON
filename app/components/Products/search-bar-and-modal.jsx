"use client";
import { useProducts } from "@/contexts/ProductsContext";
import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

export default function SearchBarAndModal() {
  const {
    searchProducts,
    searchedProducts,
    loadingSearchedProducts,
    errorSearchedProducts,
  } = useProducts();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useQueryState("qp", {
    defaultValue: "",
  });

  useEffect(() => {
    async function runSearch() {
      console.log("runSearch");
      if (query.length > 0) {
        setOpen(true);
      }
      await searchProducts(query || "");
    }

    runSearch();
  }, [query]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <input onChange={(e) => setQuery(e.target.value)} value={query} />
        {loadingSearchedProducts ? (
          "Loading.."
        ) : errorSearchedProducts ? (
          `Error Searching products: ${errorSearchedProducts}`
        ) : searchProducts && searchedProducts.length === 0 ? (
          `No products found matching the query: ${query}`
        ) : (
          // JSON.stringify(searchedProducts)
          <div>searched products go here</div>
        )}
      </div>
    </Suspense>
  );
}
