"use client";

import { useProducts } from "@/contexts/ProductsContext";
import { useEffect } from "react";
import SearchBarAndModal from "./search-bar-and-modal";
import CategoriesCombobox from "./categories-combobox";
import Link from "next/link";
import ProductItemCard from "./product-item-card";
import { Fullscreen, Maximize, WindArrowDown } from "lucide-react";
import { ButtonAsLink } from "@/components/ui/button";

export default function MinimizedProducts() {
  const { products, loading, error } = useProducts(); // length = 15;

  useEffect(() => {
    products.length = 6;
  }, [loading, products]);

  if (loading) {
    <div>Loading...</div>;
  }

  if (error) {
    <div>Error: {error}</div>;
  }

  console.log("products", products);

  return (
    <div className="flex flex-col gap-4 bg-secondary-background p-8 rounded-xl">
      {/* Top */}
      <ButtonAsLink href="/products" variant="ghost" size="icon">
        <Maximize />
      </ButtonAsLink>
      <div className="flex gap-2 items-center justify-between w-full">
        <SearchBarAndModal />
        <CategoriesCombobox />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductItemCard key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}
