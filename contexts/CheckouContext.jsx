"use client";

import { useState, useEffect } from "react";
import { useContext } from "react";
import { useCart } from "./CartContext";

const { createContext } = require("react");

const CheckoutContext = createContext(null);

export default function CheckoutProvider({children}) {
    const {cartProducts} = useCart();
    const [productsToCheckout, setProductsToCheckout] = useState([]);

    useEffect(() => {
        if (cartProducts && cartProducts.length > 0) {
            setProductsToCheckout(cartProducts);
        } else {
            setProductsToCheckout([]);
        }
    }, [cartProducts]);

    return (
        <CheckoutContext.Provider value={{
            productsToCheckout,
            setProductsToCheckout
        }}>
            {children}
        </CheckoutContext.Provider>
    )
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("This hook can't be used outside a provider");
    return ctx;
}