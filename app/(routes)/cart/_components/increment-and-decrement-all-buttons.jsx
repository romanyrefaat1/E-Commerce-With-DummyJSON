"use client";

import { useCart } from "@/contexts/CartContext";

export default function IncrementAndDecrementAllButtons (selectedProducts, canDoAction) {
    const {updateProductsCount} = useCart()

    return (
        <div>
            <button onClick={()=> updateProductsCount(selectedProducts, 1)} disabled={canDoAction}>Increase</button>
            <button onClick={()=> updateProductsCount(selectedProducts, -1)} disabled={canDoAction}>Decrease</button>
        </div>
    )
}