'use client';

import React from 'react';
import { useCart } from '../lib/store/hooks';
import { Chip } from '@heroui/react';
import { FiTag, FiShoppingBag, FiGift } from 'react-icons/fi';

export default function OrderSummary() {
  const { items } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemPromoInfo = (item) => {
    if (!item.hasPromo) return null;
    
    const promo = item.promo;
    if (!promo) return null;

    const promoBundles = Math.floor(item.quantity / promo.qte);
    const remainingItems = item.quantity % promo.qte;
    const promoPrice = promoBundles * promo.price;
    const regularPrice = remainingItems * item.price;
    const totalPromoPrice = promoPrice + regularPrice;
    const savings = item.regularTotal - totalPromoPrice;

    return {
      promo,
      promoBundles,
      remainingItems,
      promoPrice,
      regularPrice,
      totalPromoPrice,
      savings
    };
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <FiShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد عناصر في السلة</p>
          <p className="text-gray-400 text-sm mt-2">أضف بعض المنتجات لرؤية ملخص الطلب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const promoInfo = getItemPromoInfo(item);
        
        return (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4 mb-3">
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">{item.name}</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">الكمية:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">{item.quantity}</span>
                  </div>
                  
                  {/* Unit Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">سعر الوحدة:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                  </div>
                  
                  {/* Total Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المجموع:</span>
                    <span className={`font-semibold ${item.promoApplied ? 'line-through text-gray-500 text-sm' : 'text-gray-900'}`}>
                      {formatPrice(item.regularTotal)}
                    </span>
                  </div>
                  
                  {/* Promotional Total */}
                  {item.promoApplied && (
                    <div className="flex justify-between items-center bg-green-50 -mx-3 -mb-2 px-3 py-2 rounded-b-lg">
                      <span className="text-green-800 font-medium flex items-center gap-1">
                        <FiGift className="h-4 w-4" />
                        بعد العرض:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-700 text-lg">
                          {formatPrice(item.promoTotal)}
                        </span>
                        <Chip size="sm" color="success" variant="solid" className="text-white">
                          عرض مطبق
                        </Chip>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Savings Badge */}
                 {item.savings > 0 && (
                   <div className="mt-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg flex items-center justify-between">
                     <span className="font-medium flex items-center gap-1">
                       <FiGift className="h-4 w-4" />
                       وفرت:
                     </span>
                     <span className="font-bold text-lg">{formatPrice(item.savings)}</span>
                   </div>
                 )}
               </div>
             </div>
            
            {/* Promo Information */}
            {promoInfo && (
              <div className={`mt-4 rounded-xl border-2 ${promoInfo.promoBundles > 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'} p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${promoInfo.promoBundles > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <FiTag className={`h-5 w-5 ${promoInfo.promoBundles > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-lg font-bold ${promoInfo.promoBundles > 0 ? 'text-green-800' : 'text-gray-800'}`}>عرض خاص</span>
                </div>
                
                <div className={`space-y-3 ${promoInfo.promoBundles > 0 ? 'text-green-700' : 'text-gray-700'}`}>
                  <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                    <div className="text-sm font-medium mb-1">تفاصيل العرض:</div>
                    <div className="text-base font-semibold">{promoInfo.promo.qte} قطع بـ {formatPrice(promoInfo.promo.price)}</div>
                  </div>
                  
                  {promoInfo.promoBundles > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Chip size="md" color="success" variant="solid" className="text-white font-medium">
                        ✨ {promoInfo.promoBundles} عروض مطبقة
                      </Chip>
                      {promoInfo.remainingItems > 0 && (
                        <Chip size="md" color="default" variant="bordered" className="font-medium">
                          {promoInfo.remainingItems} بالسعر العادي
                        </Chip>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}