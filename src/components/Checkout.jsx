'use client';

import React, { useState } from 'react';
import { useCart } from '../lib/store/hooks';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { FiUser, FiPhone,FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import OrderSummary from './OrderSummary';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { items, totalAmount, totalSavings, clearAllItems } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price) => {
    return `${Math.round(price).toLocaleString('ar-DZ')} دج`;
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare order details as JSON
      const orderDetails = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          regularTotal: item.regularTotal,
          promoTotal: item.promoTotal || item.regularTotal,
          savings: item.savings || 0,
          hasPromo: item.hasPromo || false,
          promo: item.promo || null
        })),
        totalSavings: totalSavings,
        regularTotalAmount: totalAmount + totalSavings
      };

      // Insert order into database
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerInfo.name,
            phone: customerInfo.phone,
            notes: customerInfo.notes || null,
            total: totalAmount,
            details: orderDetails
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('Order saved successfully:', data);

      // Send email notification via API
      try {
        const emailResponse = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerNotes: customerInfo.notes,
            total: totalAmount,
            items: items.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              regularTotal: item.regularTotal,
              promoTotal: item.promoTotal || item.regularTotal,
              hasPromo: item.hasPromo || false,
              promo: item.promo || null
            }))
          })
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('Failed to send email notification:', emailResponse.status, errorText);
          // Don't throw error here - order was saved successfully
        } else {
          const result = await emailResponse.json();
          console.log('Email notification sent successfully:', result);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't throw error here - order was saved successfully
      }

      alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      clearAllItems();
      
      // إعادة تعيين النموذج
      setCustomerInfo({
        name: '',
        phone: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center p-6 sm:p-8">
            <FiShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">السلة فارغة</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4">يرجى إضافة منتجات إلى السلة أولاً</p>
            <Button 
              color="primary" 
              onPress={() => window.location.href = '/products'}
              size="lg"
              className="w-full"
            >
              تصفح المنتجات
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-4 sm:py-8">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-12">
        {/* Header Section - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row  sm:space-x-4 space-y-3 sm:space-y-0 mb-6">
  <div className="inline-flex sm:ml-4 items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-950/85 rounded-full mx-auto sm:mx-0">
    <FiShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
  </div>
  <div className="text-center sm:text-right">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950/85">إتمام الطلب</h1>
    <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">أكمل بياناتك لإتمام عملية الطلب</p>
  </div>
</div>

        {/* Main Content Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Customer Information - Shows first on mobile */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
                    <FiUser className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">معلومات العميل</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Form Fields - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input
                    label="الاسم الكامل"
                    placeholder="أدخل اسمك الكامل"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    startContent={<FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />}
                    isRequired
                    size="lg"
                    classNames={{
                      input: "text-base sm:text-lg",
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
                  
                  <Input
                    label="رقم الهاتف"
                    placeholder="أدخل رقم هاتفك"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    startContent={<FiPhone className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />}
                    isRequired
                    size="lg"
                    classNames={{
                      input: "text-base sm:text-lg",
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
                
                <Textarea
                  label="ملاحظات إضافية (اختياري)"
                  placeholder="أي ملاحظات أو تعليمات خاصة"
                  value={customerInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  minRows={2}
                  classNames={{
                    input: "text-base sm:text-lg",
                    inputWrapper: [
                      "bg-white",
                      "border-1", 
                      "border-gray-200",
                      "hover:bg-white", 
                      "focus:bg-white",
                      "focus-within:!bg-white",
                      "data-[hover=true]:bg-white",
                      "group-data-[focus=true]:bg-white"
                    ].join(" "),
                  }}
                />
              </CardBody>
            </Card>
          </div>

          {/* Order Summary - Shows second on mobile, sticky on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:sticky lg:top-8">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
                    <FiShoppingBag className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">ملخص الطلب</h2>
                </div>
              </CardHeader>
              <CardBody className="p-4 sm:p-6">
                <OrderSummary />

                <Divider className="my-4 sm:my-6" />

                <div className="space-y-3 sm:space-y-4 bg-gray-50 rounded-xl p-3 sm:p-4">
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">المجموع بدون عروض:</span>
                      <span className="line-through text-gray-500">
                        {formatPrice(totalAmount + totalSavings)}
                      </span>
                    </div>
                  )}
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium flex items-center gap-1 text-xs sm:text-sm">
                        التوفير من العروض:
                      </span>
                      <span className="font-bold text-green-600 text-sm sm:text-lg">-{formatPrice(totalSavings)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm">رسوم التوصيل:</span>
                    <span className="font-medium text-green-600 text-xs sm:text-base">مجاني ✨</span>
                  </div>
                  
                  <Divider className="bg-gray-300" />
                  
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 sm:p-4 rounded-lg">
                    <span className="text-base sm:text-xl font-bold">المجموع النهائي:</span>
                    <span className="text-lg sm:text-2xl font-bold">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Submit Button - Mobile Optimized */}
                <div className="mt-4 sm:mt-6">
                  <Button
                    color="success"
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-base sm:text-lg h-12 sm:h-14 shadow-lg"
                    onPress={handleSubmitOrder}
                    isLoading={isSubmitting}
                    startContent={!isSubmitting && <FiCreditCard className="h-5 w-5 sm:h-6 sm:w-6" />}
                  >
                    {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                  </Button>
                  
                  <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                    🔒 معلوماتك محمية وآمنة معنا
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}