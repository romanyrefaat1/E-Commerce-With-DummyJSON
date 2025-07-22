"use client";

import { useCart } from "@/contexts/CartContext";

import {Button} from "@/components/ui/button"

import { Minus, Plus } from "lucide-react"

export default function IncrementAndDecrementAllButtons ({selectedProducts, canDoAction}) {
    const {updateProductsCount} = useCart()

    return (
        <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={()=> updateProductsCount(selectedProducts, 1)} disabled={canDoAction}><Minus className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={()=> updateProductsCount(selectedProducts, -1)} disabled={canDoAction}><Plus className="h-4 w-4" /></Button>
        </div>
    )
}