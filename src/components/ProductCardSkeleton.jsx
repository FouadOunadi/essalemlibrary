"use client";

import React from 'react';
import { Skeleton } from '@heroui/react';

const ProductCardSkeleton = () => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50  rounded-3xl p-3 shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200  rounded-2xl overflow-hidden mb-4">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-3">
        <div>
          <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg mt-1" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-3 w-8 rounded-lg mt-1" />
          </div>
          
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Quantity and Add to Cart Skeleton */}
        <div className="flex items-center gap-3 pt-2">
          {/* Quantity Controls Skeleton */}
          <div className="flex items-center bg-gray-100  rounded-xl border border-gray-200">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 mx-2 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>

          {/* Add to Cart Button Skeleton */}
          <Skeleton className="flex-1 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;