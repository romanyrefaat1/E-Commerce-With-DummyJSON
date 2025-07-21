import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartCard ({data, isChecked, setSelectedProducts}) {
    const {updateProductCount} = useCart()

    const handleChange = ()=> {
        if (isChecked) {
            setSelectedProducts(prev=> prev.filter((product)=> product.id !== data.id))
            return;
        }

        setSelectedProducts(prev => [...prev, data.id])
        }
    
    return (
        <div>
            <button onClick={()=> updateProductCount(data.id, 1)}>Increase</button>
            <button onClick={()=> updateProductCount(data.id, -1)}>Decrease</button>
            <Link href={"/products/"+data.id}>Visit Product</Link>
            <input type="checkbox" checked={isChecked} onChange={handleChange}/>
            {JSON.stringify(data)}
        </div>
    )
}