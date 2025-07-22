import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

export default function ProductItemCard({ data }) {
  const {
    updateProductInCart,
    removeProductFromCart,
    findProductInCart,
    getIsProductInCart,
  } = useCart();
  const productInCart = findProductInCart(data.id);
  const isProductInCart = getIsProductInCart(data.id);

  const [count, setCount] = useQueryState(`count-${productInCart.id}`, {
    defaultValue: productInCart?.cart_count ?? 0,
  });

  console.log("data:", data);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="card bg-base-100 shadow-sm w-full">
        <figure>
          <Image
            width={300}
            height={200}
            src={
              data.images[0] ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={data.title || "Product image"}
          />
        </figure>
        <div className="card-body">
          <h3>{data.title || "Product"}</h3>
          <p>{data.description || "No description available."}</p>
          <div className="flex items-center gap-2 mb-2">
            <button
              className="btn btn-sm"
              onClick={() => setCount((prev) => prev - 1)}
            >
              -
            </button>
            <span>{count}</span>
            <button
              className="btn btn-sm"
              onClick={() => setCount((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <div className="card-actions justify-end">
            <Button
              variant={isProductInCart ? "destructive" : "default"}
              className={cn(
                "btn btn-error",
                !isProductInCart && "btn btn-primary"
              )}
              onClick={() => {
                isProductInCart
                  ? removeProductFromCart(data.id)
                  : updateProductInCart(data, count);
              }}
            >
              {isProductInCart
                ? `Remove ${productInCart.cart_count} from cart`
                : "Add To Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
