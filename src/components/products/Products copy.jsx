"use client";

import React, { useState, useEffect, useRef, useCallback , useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Button, Input, Skeleton } from '@heroui/react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import debounce from 'lodash/debounce';

// Utility function for client-side normalization (fallback or for UI)
const normalizeArabicForSearch = (text) => {
  if (!text) return '';
  return text
    .replace(/[أإآا]/g, 'ا')
    .replace(/[يى]/g, 'ي')
    .replace(/[ةه]/g, 'ة')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

const Products = ({ selectedCategories = [] }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isPaginationChange, setIsPaginationChange] = useState(false);
  const productsPerPage = 12;
  const productsRef = useRef(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Fetch paginated and filtered products
  const fetchProducts = useCallback(async (page, search) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(
          `
          *,
          prod_img(img),
          categories(id, name)
        `,
          { count: 'exact' }
        );

      // Apply category filter
      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories);
      }

      // Apply search filter using server-side normalization
      if (search.trim()) {
        const normalizedSearch = normalizeArabicForSearch(search);
        // Use PostgreSQL normalize_arabic function
        query = query.filter('name', 'ilike', `%${normalizedSearch}%`);
        // Alternative: Use RPC to apply normalization server-side
        // query = supabase.rpc('search_products', { search_term: normalizedSearch });
      }

      // Apply pagination
      const startIndex = (page - 1) * productsPerPage;
      query = query.range(startIndex, startIndex + productsPerPage - 1);

      // Order by category or name
      query = selectedCategories.length === 0 && !search.trim()
        ? query.order('category_id').order('name')
        : query.order('name');

      const { data, error, count } = await query;
      if (error) throw error;

      setProducts(data || []);
      setTotalProducts(count || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, productsPerPage]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Group products by category for display
  const groupedProducts = useMemo(() => {
    if (selectedCategories.length > 0 || searchTerm.trim()) {
      return [{ categoryName: null, products }];
    }

    const grouped = {};
    products.forEach(product => {
      const categoryName = product.categories?.name || 'غير مصنف';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    return Object.entries(grouped).map(([categoryName, products]) => ({
      categoryName,
      products
    }));
  }, [products, selectedCategories.length, searchTerm]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when page, search, or categories change
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [fetchProducts, currentPage, searchTerm, selectedCategories]);

  // Scroll to top on pagination change
  useEffect(() => {
    if (isPaginationChange && productsRef.current) {
      productsRef.current.scrollIntoView({ block: 'start' });
      setIsPaginationChange(false);
    }
  }, [isPaginationChange]);

  // Search input handler
  const handleSearch = useCallback((value) => {
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Skeleton component
  const ProductCardSkeleton = () => (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50 rounded-3xl p-3 shadow-sm">
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden mb-4">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg mt-1" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-3 w-8 rounded-lg mt-1" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 mx-2 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
          <Skeleton className="flex-1 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );

  // Pagination rendering
  const renderPagination = useCallback(() => {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="light"
          isIconOnly
          onPress={() => {
            setIsPaginationChange(true);
            setCurrentPage(currentPage - 1);
          }}
          isDisabled={currentPage === 1}
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>
        {startPage > 1 && (
          <>
            <Button
              variant={1 === currentPage ? "solid" : "light"}
              onPress={() => {
                setIsPaginationChange(true);
                setCurrentPage(1);
              }}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "solid" : "light"}
            onPress={() => {
              setIsPaginationChange(true);
              setCurrentPage(page);
            }}
          >
            {page}
          </Button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant={totalPages === currentPage ? "solid" : "light"}
              onPress={() => {
                setIsPaginationChange(true);
                setCurrentPage(totalPages);
              }}
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="light"
          isIconOnly
          onPress={() => {
            setIsPaginationChange(true);
            setCurrentPage(currentPage + 1);
          }}
          isDisabled={currentPage === totalPages}
        >
          <FiChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [totalProducts, currentPage]);

  return (
    <div className="bg-stone-100 dark:bg-gray-900 py-8" dir="rtl" ref={productsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="text-center mb-8 max-w-[50%] mx-auto">
            <Input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ابحث عن المنتجات..."
              startContent={
                <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              }
              size="lg"
              radius="full"
              classNames={{
                input: "text-right",
                inputWrapper: [
                  "bg-white",
                  "border-1",
                  "border-gray-200",
                  "hover:bg-white",
                  "focus:bg-white",
                  "focus-within:!bg-white",
                  "data-[hover=true]:bg-white",
                  "group-data-[focus=true]:bg-white"
                ].join(" ")
              }}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                {groupedProducts.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-8">
                    {group.categoryName && selectedCategories.length === 0 && !searchTerm.trim() && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                          {group.categoryName}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {group.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedCategories.length > 0
                    ? 'لم يتم العثور على منتجات تطابق البحث أو الفئات المحددة'
                    : 'لا توجد منتجات متاحة حالياً'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;