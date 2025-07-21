"use client";

import { useCart } from "@/contexts/CartContext";

export default function DeleteProductFromCartButton({selectedProducts, canDoAction}) {
    const {removeProductsFromCart} = useCart();

    const handleDelete = ()=> {
        removeProductsFromCart(selectedProducts)
    }
    
    return (
        <button onClick={handleDelete} disabled={canDoAction}>Delete</button>
    )
}