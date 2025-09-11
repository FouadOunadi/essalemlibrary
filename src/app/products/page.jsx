"use client";

import { useState } from 'react';
import Categories from '@/components/products/Categories';
import Products from '@/components/products/Products';

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle category selection from Categories component
  const handleCategorySelect = (selectedCategoryIds) => {
    setSelectedCategories(selectedCategoryIds);
  };

  return (
    <div className="py-4">
      <Categories 
        categories={categories}  
        setCategories={setCategories}
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
      />
      <Products 
        selectedCategories={selectedCategories} 
      />
    </div>
  );
}