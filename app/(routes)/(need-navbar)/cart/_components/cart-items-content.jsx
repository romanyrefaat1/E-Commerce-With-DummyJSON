"use client";

import { useState } from "react";
import CartCard from "./cart-card";
import { useCart } from "@/contexts/CartContext";
import DeleteProductFromCartButton from "./delete-products-from-cart-button";
import IncrementAndDecrementAllButtons from "./increment-and-decrement-all-buttons";
import { useCheckout } from "@/contexts/CheckouContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartItemsContent () {
    const {cartProducts} = useCart();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const canDoAction = selectedProducts.length > 0;
    const {setProductsToCheckout} = useCheckout();
    const router = useRouter();

    if (!cartProducts) { 
        <div className="w-full h-full"><p>"An Unkwon error happened"</p></div>
    } else if (cartProducts.length === 0){
        return <div className="w-full h-full">
            <p>You do not have items in the Cart. Click <Link href="/products">Here</Link> to browse more products.</p>
        </div>
    }
     
    const handleBuy = ()=>{
        if (!canDoAction) {
            // Buy all cart products
            setProductsToCheckout(cartProducts.map((product)=> product.id));
            router.push("/checkout");
            return;
        }
        
        // Buy selected cart products
        setProductsToCheckout(selectedProducts)
        router.push("/checkout");
    }
     
     return (
        <div className="relative">
             <div className="sticky top-0 left-0">
                <p>Selected Items: {selectedProducts.length}</p>
                <DeleteProductFromCartButton selectedProducts={selectedProducts} canDoAction={canDoAction} />
                <IncrementAndDecrementAllButtons canDoAction={canDoAction} />
                <button onClick={handleBuy}>{canDoAction ? "Buy Selected" : `Buy All`}</button>
            </div>
            {cartProducts.map((product)=> (
                <CartCard
                    key={product.id}
                    isChecked={selectedProducts.find((pr)=> pr.id === product.id) !== undefined}
                    data={product}
                    setSelectedProducts={setSelectedProducts}
                />
            ))}
        </div>
    )
}