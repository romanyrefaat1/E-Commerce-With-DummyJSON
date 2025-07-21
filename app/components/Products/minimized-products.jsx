"use client"

import { useProducts } from "@/contexts/ProductsContext"
import { useEffect } from "react";
import SearchBarAndModal from "./search-bar-and-modal";
import CategoriesCombobox from "./categories-combobox";
import Link from "next/link"

export default async function MinimizedProducts () {
    const {products, loading, error} = useProducts(); // length = 15;

    useEffect(()=> {
        products.length = 6;
    }, [loading, products])

    if (loading) {
        <div>Loading...</div>
    }

    if (error) {
        <div>Error: {error}</div>
    }

   return (
    <div>
        {/* Top */}
        <div className="flex gap-2 items-center w-full">
            <SearchBarAndModal />
            <CategoriesCombobox />
            <Link href="/products">Full Screen</Link>
        </div>
        <div>
        {products.map((product)=> (
            <ProductItemCard key={product.id} data={product}/>
        ))}
        </div>
    </div>
   )
}