import { useCheckout } from "@/contexts/CheckouContext"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutButton ({products}) {
    const [error, setError] = useState(null);
    const [routing, setRouting] = useState(false);
    const router = useRouter();

    const handleCheckout = async ()=> {
        setRouting(true);
        console.log("cart products:", products)
        // return;
        try {
            
            const response = await fetch("/api/checkout/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems: products,
                    formData: {
                        city: "Giza",
                            country: "EG",
                            state: "Feisal",
                            addressLine: "32 El Nast Street",
                            zipCode: "10820",
                            email: "refaatromany641@gmail.com",
                            firstName: "Romany",
                            lastName: "Refaat",
                    }
                })
            })
            
            if (!response.ok) {
                throw new Error('Failed to create payment link');
            }
        
            const { paymentLink, totalAmount } = await response.json();
            router.push(paymentLink)
            
        } catch (error) {
            console.error("Error", error);
        } finally {
            setRouting(false);
        }
    }
    return (
        <button onClick={handleCheckout}>Proceed to Checkout</button>
    )
}