"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Skeleton } from "@heroui/react";

const Categories = ({categories, setCategories, selectedCategories = [], onCategorySelect}) => {
  
  const [internalSelectedCategories, setInternalSelectedCategories] = useState(selectedCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    let updatedSelection;
    
    if (internalSelectedCategories.includes(categoryId)) {
      // Remove category if already selected
      updatedSelection = internalSelectedCategories.filter(id => id !== categoryId);
    } else {
      // Add category to selection
      updatedSelection = [...internalSelectedCategories, categoryId];
    }
    
    setInternalSelectedCategories(updatedSelection);
    
    // Call parent callback if provided
    if (onCategorySelect) {
      onCategorySelect(updatedSelection);
    }
  };

  // Check if category is selected
  const isCategorySelected = (categoryId) => {
    return internalSelectedCategories.includes(categoryId);
  };

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (!categoriesError) {
        setCategories(categoriesData || []);
      }
      setIsLoading(false);
    }
    
    fetchCategories();
  }, []);

  // Skeleton loader component
  const CategorySkeleton = () => (
    <div className="group flex flex-col space-y-2 items-center justify-center  bg-white p-2 border-1 rounded-full overflow-hidden border-gray-200 dark:bg-gray-800 dark:border-gray-600">
     
        <Skeleton className="w-10 h-10 rounded-full" />
      
      <Skeleton className="h-6 w-28 rounded-full" />
    </div>
  );

  return (
    <div className=" dark:bg-gray-900 mt-4 pb-4 " dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white ">
            تسوق حسب الفئة
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            اكتشف مجموعتنا الواسعة من المنتجات المنظمة حسب الفئات
          </p>
          
          {/* Selection Info */}
          {!isLoading && internalSelectedCategories.length > 0 && (
            <div className="mt-4 flex items-center  justify-center gap-4">
              <span className="bg-indigo-100 w-[8rem] dark:bg-ingido-800 text-indigo-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {internalSelectedCategories.length} فئة محددة
              </span>
              <button
                onClick={() => {
                  setInternalSelectedCategories([]);
                  if (onCategorySelect) {
                    onCategorySelect([]);
                  }
                }}
                className="text-red-600 cursor-pointer dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
              >
                مسح الكل
              </button>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-6">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 12 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : (
            // Show actual categories when loaded
            categories.map((category) => {
              const isSelected = isCategorySelected(category.id);
              
              return (
                <div 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                     group bg-white p-2 cursor-pointer border-1 rounded-full hover:shadow-sm 
                     transition-all duration-300 overflow-hidden hover:scale-105
                     dark:bg-gray-800
                     ${
                       isSelected 
                         ? 'border-indigo-500 dark:border-indigo-400' 
                         : 'border-gray-200 dark:border-gray-600'
                     }
                   `}
                >
                  {/* Category Image/Icon */}
                  <div className="bg-white rounded-full flex items-center justify-center">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className={`w-10 h-10 transition-all duration-300 ${
                        isSelected ? 'scale-110' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Category Info */}
                  <h3 className={`
                     text-lg font-semibold text-center mb-2 transition-colors
                     ${
                       isSelected 
                         ? 'text-indigo-500 dark:text-indigo-400 font-bold' 
                         : 'text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                     }
                   `}>
                      {category.name}
                    </h3>
                  
                </div>
              );
            })
          )}
        </div>
       
      </div>
    </div>
  );
};

export default Categories;