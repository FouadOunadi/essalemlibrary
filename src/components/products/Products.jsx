"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Button, Input, Skeleton } from '@heroui/react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import debounce from 'lodash/debounce';

const Products = ({ selectedCategories = [] }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // الجديد: نفصل بين قيمة الكتابة الفورية وقيمة البحث المؤجلة
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isPaginationChange, setIsPaginationChange] = useState(false);
  const productsPerPage = 12;
  const productsRef = useRef(null);

  // --- API ---

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

  const fetchProducts = useCallback(async (page) => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(
          `
          *,
          prod_img(img),
          categories(id, name),
          promo(qte,price)
        `,
          { count: 'exact' }
        );

      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories);
      }

      const startIndex = (page - 1) * productsPerPage;
      query = query.range(startIndex, startIndex + productsPerPage - 1);

      query = selectedCategories.length === 0
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



  // البحث عبر RPC ثم نجلب الصور من جدول prod_img لكل منتج + نعمل pagination في الفرونت
  const searchProducts = useCallback(async (page, search) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("search_products", {
        search_term: search.trim(),
      });
      if (error) throw error;

      const startIndex = (page - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginated = data ? data.slice(startIndex, endIndex) : [];

      const withImages = await Promise.all(
        paginated.map(async (product) => {
          const { data: imgs } = await supabase
            .from("prod_img")
            .select("img")
            .eq("product_id", product.id);

          return { ...product, prod_img: imgs || [] };
        })
      );

      setProducts(withImages);
      setTotalProducts(data?.length || 0);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  }, [productsPerPage]);

  // --- Debounce setup ---

  // نعمل debounce لتحديث searchTerm فقط (مش inputValue)
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  // تنظيف الـ debounce عند التفكيك
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // handler للـ Input: يحدّث العرض فورًا ويستدعي debounce للبحث
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);      // فوري بدون أي تأخير
    debouncedSearch(value);    // البحث بعد التوقف
  }, [debouncedSearch]);

  // --- Grouping ---

  const groupedProducts = useMemo(() => {
    if (selectedCategories.length > 0 || searchTerm.trim()) {
      return [{ categoryName: null, products }];
    }

    const grouped = {};
    products.forEach(product => {
      const categoryName = product.categories?.name || product.category_name || 'غير مصنف';
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

  // --- Effects ---

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchProducts(currentPage, searchTerm);
    } else {
      fetchProducts(currentPage);
    }
  }, [fetchProducts, searchProducts, currentPage, searchTerm, selectedCategories]);

  useEffect(() => {
    if (isPaginationChange && productsRef.current) {
      productsRef.current.scrollIntoView({ block: 'start' });
      setIsPaginationChange(false);
    }
  }, [isPaginationChange]);

  // --- UI ---

  const ProductCardSkeleton = () => (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50  rounded-3xl p-3 shadow-sm">
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200  rounded-2xl overflow-hidden mb-4">
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
          <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200 ">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 mx-2 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
          <Skeleton className="flex-1 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );

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

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="light"
          isIconOnly
          onPress={() => { setIsPaginationChange(true); setCurrentPage(currentPage - 1); }}
          isDisabled={currentPage === 1}
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={1 === currentPage ? "solid" : "light"}
              onPress={() => { setIsPaginationChange(true); setCurrentPage(1); }}
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
            onPress={() => { setIsPaginationChange(true); setCurrentPage(page); }}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant={totalPages === currentPage ? "solid" : "light"}
              onPress={() => { setIsPaginationChange(true); setCurrentPage(totalPages); }}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="light"
          isIconOnly
          onPress={() => { setIsPaginationChange(true); setCurrentPage(currentPage + 1); }}
          isDisabled={currentPage === totalPages}
        >
          <FiChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [totalProducts, currentPage]);

  return (
    <div className="bg-stone-100  py-8" dir="rtl" ref={productsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="mb-8">
          <div className="text-center mb-8 w-full md:w-[50%] md:mx-auto">
            <Input
              type="text"
              value={inputValue}                 // ← فوري بدون تأخير
              onChange={handleInputChange}       // ← يحدّث searchTerm بعد التوقف
              placeholder="ابحث عن المنتجات..."
              startContent={<FiSearch className="h-5 w-5 text-gray-400" />}
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
            {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                {groupedProducts.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-8">
                    {group.categoryName && selectedCategories.length === 0 && !searchTerm.trim() && (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
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
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-gray-500">
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
