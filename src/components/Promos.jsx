'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiTag, FiPercent, FiGift } from 'react-icons/fi';

const Promos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo')
        .select('name, qte, price')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setPromos(data || []);
    } catch (error) {
      console.error('Error fetching promos:', error);
      setError('فشل في تحميل العروض');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">العروض الخاصة</h2>
            <div className="flex justify-center items-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm md:text-base text-gray-600">جاري تحميل العروض...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
              <FiTag className="mx-auto h-8 w-8 md:h-12 md:w-12 text-red-400 mb-4" />
              <h3 className="text-base md:text-lg font-medium text-red-800 mb-2">خطأ في التحميل</h3>
              <p className="text-sm md:text-base text-red-600">{error}</p>
              <button 
                onClick={fetchPromos}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (promos.length === 0) {
    return (
      <div className="py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
              <FiGift className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4" />
              <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">لا توجد عروض متاحة حالياً</h3>
              <p className="text-sm md:text-base text-gray-600">تابعونا للحصول على أحدث العروض والخصومات</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 pb-12 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-7 md:mb-11">
          <div className="relative flex items-center justify-center mb-1 md:mb-0  ">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-stone-300 rounded-full" style={{zIndex: 1}}></div>
            <span className="relative inline-flex border-8 md:border-24 border-stone-100 items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-gray-950 rounded-full" style={{zIndex: 2}}>
              <FiPercent className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">العروض الخاصة</h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            اكتشف أفضل العروض والخصومات على منتجاتنا المميزة
          </p>
        </div>

        {/* Promos Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {promos.map((promo, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl shadow-xs hover:shadow-md transition-all transform translate-y-0 hover:translate-y-[-4px] md:hover:translate-y-[-10px] duration-300 overflow-hidden border border-gray-200"
            >
              {/* Promo Badge */}
              <div className="absolute top-4 md:top-6 left-4 md:left-6 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg">
                  <FiTag className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 ml-1" />
                  عرض خاص
                </div>
              </div>
              
              <div className="relative p-4 md:p-6">
                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FiGift className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>

                {/* Promo Name */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 transition-colors duration-300">
                  {promo.name}
                </h3>

                {/* Quantity */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 md:mb-4">
                  <span className="text-xs md:text-sm text-gray-600 font-medium">
                    الكمية المطلوبة للاستفادة من العرض
                  </span>
                  <span className="text-base md:text-lg font-bold text-green-600">{promo.qte}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between bg-stone-100 p-2 md:p-2 px-3 md:px-4 rounded-lg">
                  <span className="text-xs md:text-sm text-gray-600 font-medium">السعر</span>
                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-bold text-indigo-500">{promo.price}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-500 mr-1">دج</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promos;