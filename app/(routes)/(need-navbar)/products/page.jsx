"use client"

import { useProducts } from "@/contexts/ProductsContext"
import ProductItemCard from "@/app/components/Products/product-item-card";
import SearchBarAndModal from "@/app/components/Products/search-bar-and-modal";
import CategoriesCombobox from "@/app/components/Products/categories-combobox";

export default function ProductsPage () {
    const {products, loading, error} = useProducts(); // length = 15;

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

   return (
    <div>
        <h1>All Products</h1>
        {/* Top */}
        <div className="flex gap-2 items-center w-full">
            <SearchBarAndModal />
            <CategoriesCombobox />
        </div>
        <div>
            {JSON.stringify(products)}
        {/* {products.map((product)=> (
            <ProductItemCard key={product.id} data={product}/>
        ))} */}
        </div>
    </div>
   )
}