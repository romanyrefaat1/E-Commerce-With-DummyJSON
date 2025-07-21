import { useCart } from "@/contexts/CartContext"
import {useQueryState} from "nuqs";
import {Suspense} from "react"


export default function ProductItemCard({data}) {
    const {
        updateProductInCart,
        removeProductFromCart,
        findProductInCart,
        getIsProductInCart
    } = useCart();
    const productInCart = findProductInCart(data.id);
    const isProductInCart = getIsProductInCart(data.id);
    
    const [count, setCount] = useQueryState("count", {
        defaultValue: productInCart?.cart_count ?? 0
    })

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <b>Product:</b>
            <buttton onClick={()=> setCount(prev => prev-1)}>Decrease Count</buttton>
            
            {isProductInCart ? 
            <button onClick={()=> removeProductFromCart(data.id)}>Remove {productInCart.cart_count} items from cart</button>
            :<button onClick={()=> updateProductInCart(data, count)}>Add To Cart</button>}

            <buttton onClick={()=> setCount(prev => prev+1)}>Increase Count</buttton>
            {JSON.stringify(data)}
        </div>
        </Suspense>
    )
}