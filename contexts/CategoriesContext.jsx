"use client";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useQueryState } from "nuqs"
import { Suspense } from "react";

const CategoriesContext = createContext(null);

export default function CategoriesProvider ({children}) {
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);
    const [categories, setCategories] = useState(null);
    const [categoryName, updateCategoryName] = useQueryState("category", {
        defaultValue: null,
    })
    const [queriedCategories, setQueriedCategories] = useState(categories);
    

    const fetchCategoriesNames = async () => {
        try {
            const response = await fetch ("https://dummyjson.com/products/categories");
            const data = await response.json();
            if (!data) setError(`Request Returned a false response: ${data}`);

            setCategories(data);
            console.log("categories", data)
           } catch (err){
            setCategoriesError(`An Unkown error happened: ${err}`);
            console.error("Unkown Error found:", err)
           } finally{
            setIsCategoriesLoading(false)
           }
    }

    useEffect(()=> {
        if (!categoryName || !categories || isCategoriesLoading || categoriesError) return;
        
        categories.forEach((category)=> {
            category.includes(categoryName) && queriedCategories.push(category);
        })
    },[categoryName])

    return (
    <Suspense fallback={<div>Loading...</div>}>
        <CategoriesContext.Provider value={{
            categoriesError,
            isCategoriesLoading,
            categories,
            categoryName,
            updateCategoryName,
            fetchCategoriesNames,
            categoryName,
            updateCategoryName
        }}>{children}</CategoriesContext.Provider>
        </Suspense>
    )
}

export function useCategories () {
    const ctx = useContext(CategoriesContext);
    if (!ctx) throw new Error("This hook can't be used outside a provider");
    return ctx;
} 