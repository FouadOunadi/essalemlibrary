'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../lib/store/hooks';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from '@heroui/react';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function CartDrawer() {
  const { 
    items, 
    totalQuantity, 
    totalAmount,
    regularTotalAmount,
    totalSavings,
    isOpen, 
    toggleCartDrawer,
    updateItemQuantity,
    removeFromCart,
    clearAllItems,
    getItemPromoInfo,
    loadPromos,
    closeCartDrawer
  } = useCart();

  const router = useRouter();
  const pathname = usePathname();
  // Close cart drawer when route changes
  useEffect(() => {
    if (isOpen) {
      closeCartDrawer();
    }
  }, [pathname]);

  // Load promotions from database when component mounts
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data: promosData, error } = await supabase
          .from('promo')
          .select('*');
     
        
        // Load promos into cart store
        if (promosData) {
          loadPromos(promosData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPromos();
  }, [loadPromos]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateItemQuantity(id, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return `${Math.round(price).toLocaleString('ar-DZ')} دج`;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={toggleCartDrawer}
      placement="right"
      size="5xl"
      scrollBehavior="inside"
      dir="rtl"
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: "easeOut"
            }
          },
          exit: {
            x: 0,
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn"
            }
          }
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="h-5 w-5" />
              <span>سلة التسوق</span>
            </div>
            <div className="text-sm text-gray-500">
              {totalQuantity} عنصر
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody className="px-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">سلة التسوق فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const promoInfo = getItemPromoInfo(item.id, item.quantity);
                
                return (
                  <div key={item.id} className="flex flex-col space-y-2 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-1">

                        <div className='flex items-center space-x-2'>
                          <h3 className="font-medium text-gray-900">{item.name} </h3>
                          <p>-</p>

                          {item.new_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800 font-semibold">
                                {formatPrice(item.new_price)}
                              </span>
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-600">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {/* Unit Price */}
                          
                           
                          
                          
                          {/* Total Price (price * quantity) */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">المجموع:</span>
                            {item.hasPromo && item.promoApplied ? (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(item.regularTotal)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-600">
                                {formatPrice(item.regularTotal)}
                              </span>
                            )}
                          </div>
                          
                          {/* Promo Total (if promo applied) */}
                          {item.hasPromo && item.promoApplied && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600">بعد العرض:</span>
                              <span className="text-sm font-semibold text-green-600">
                                {formatPrice(item.promoTotal)}
                              </span>
                              <Chip size="sm" color="success" variant="flat">
                                عرض مطبق
                              </Chip>
                            </div>
                          )}
                          
                          {/* {item.savings > 0 && (
                            <div className="text-xs text-green-700 font-medium">
                              وفرت: {formatPrice(item.savings)}
                            </div>
                          )} */}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <FiMinus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <FiPlus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color="danger"
                          onPress={() => removeFromCart(item.id)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Promo Information */}
                    {promoInfo && (
                      <div className={`${promoInfo.promoBundles > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border rounded-md p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                          <FiTag className={`h-4 w-4 ${promoInfo.promoBundles > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                          <span className={`text-sm font-medium ${promoInfo.promoBundles > 0 ? 'text-green-800' : 'text-gray-800'}`}>عرض خاص</span>
                        </div>
                        
                        <div className={`text-xs ${promoInfo.promoBundles > 0 ? 'text-green-700' : 'text-gray-700'} space-y-1`}>
                          <div>العرض: {promoInfo.promo.qte} قطع بـ {formatPrice(promoInfo.promo.price)}</div>
                          
                          {promoInfo.promoBundles > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <Chip size="sm" color="success" variant="flat">
                                {promoInfo.promoBundles} عروض مطبقة
                              </Chip>
                              {promoInfo.remainingItems > 0 && (
                                <Chip size="sm" color="default" variant="flat">
                                  {promoInfo.remainingItems} بالسعر العادي
                                </Chip>
                              )}
                            </div>
                          )}
                          
                          {promoInfo.savings > 0 && (
                            <div className={`font-medium ${promoInfo.promoBundles > 0 ? 'text-green-800' : 'text-gray-800'}`}>
                              وفرت: {formatPrice(promoInfo.savings)}
                            </div>
                          )}
                          
                          {item.quantity >= promoInfo.promo.qte && promoInfo.remainingItems > 0 && (
                            <div className="text-orange-600">
                              أضف {promoInfo.promo.qte - promoInfo.remainingItems} أكثر للحصول على عرض إضافي!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ModalBody>
        
        {items.length > 0 && (
          <ModalFooter className="flex flex-col space-y-4">
            {/* Price Breakdown */}
            <div className="w-full space-y-2 p-4 bg-stone-100 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">المجموع بدون عروض:</span>
                <span className={totalSavings > 0 ? "text-gray-400 line-through" : "text-gray-700"}>
                  {formatPrice(regularTotalAmount)}
                </span>
              </div>
              
              {totalSavings > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600">التوفير من العروض:</span>
                    <span className="text-green-600 font-medium">
                      -{formatPrice(totalSavings)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">المجموع النهائي:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {formatPrice(totalAmount)}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {totalSavings === 0 && (
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">المجموع النهائي:</span>
                    <span className="font-bold text-lg">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full flex space-x-4 ">
              <Button
                variant="light"
                color="danger"
                onPress={clearAllItems}
                className="flex-1"
              >
                إفراغ السلة
              </Button>
              <Button
                color="primary"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                onPress={() => {
                
                  router.push('/checkout');
                }}
                isDisabled={items.length === 0}
              >
                إتمام الطلب
              </Button>


            </div>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}