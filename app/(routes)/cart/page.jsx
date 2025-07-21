import Link from "next/link";
import CartItemsContent from "./_components/cart-items-content";

export default function CartPage() {
    return (
        <div>
            <h1>Your Cart</h1>
            <Link href="/checkout">Buy All Products Now</Link>
            <CartItemsContent />
        </div>
    )
}