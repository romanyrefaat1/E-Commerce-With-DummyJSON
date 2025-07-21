import { useCategories } from "@/contexts/CategoriesContext";
import { useEffect } from "react";

export default function CategoriesCombobox() {
  const {
    updateCategoryName,
    categoriesError,
    isCategoriesLoading,
    categories,
    fetchCategoriesNames,
    categoryName,
  } = useCategories();

  useEffect(() => {
    fetchCategoriesNames();
  }, []);

  if (isCategoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError || !categories)
    return <div>Error loading categories: {categoriesError}</div>;
  if (categories.length === 0) return <div>No categories found</div>;

  return (
    <div>
      {JSON.stringify(categories)}

      <br />
      <br />
      <br />
      <br />
      <div onClick={() => updateCategoryName("smartphones")}>
        My smartphones category
      </div>
    </div>
  );
}
