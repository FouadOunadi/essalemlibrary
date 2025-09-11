'use client';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { FaPenFancy, FaUserPlus, FaGamepad, FaMobile, FaWifi, FaUniversity, FaGraduationCap } from 'react-icons/fa';
import { FiEdit3, FiGlobe, FiCheck, FiDollarSign, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';



const ServicesPage = () => {
  const [showOffers, setShowOffers] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [gameProducts, setGameProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from Supabase
  const fetchGameProducts = async (gameType) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('game', gameType)
        .order('price', { ascending: true });

      if (error) throw error;
      
      setGameProducts(data || []);
    } catch (err) {
      setError('فشل في تحميل العروض. يرجى المحاولة مرة أخرى.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowOffers = async (gameType) => {
    setSelectedGame(gameType);
    setShowOffers(true);
    await fetchGameProducts(gameType);
  };

  const handleCloseOffers = () => {
    setShowOffers(false);
    setSelectedGame('');
    setGameProducts([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-tajawal">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدماتنا المتميزة</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الرقمية والتعليمية لخدمة عملائنا الكرام
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        
        {/* Gaming Recharge Section */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaGamepad className="text-3xl text-red-600" />
              <h2 className="text-3xl font-bold text-gray-800">شحن الألعاب</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              شحن UC لببجي موبايل والماسات لفري فاير بأسرع وقت وأفضل الأسعار
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PUBG Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-center">
                <div className='bg-stone-100 p-6 rounded-xl mb-4'>
                 <div className="w-24 h-24 bg-stone-100 p-2 mx-auto rounded-xl overflow-hidden flex items-center justify-center relative">
                <Image 
                  src="/pubg.jpg" 
                  alt="pubg" 
                  fill
                  className="object-cover"
                />
                </div>
              </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">شحن PUBG Mobile</h3>
                
                <ul className="text-sm text-gray-700 mb-6 space-y-1">
                  <li>• تسليم فوري خلال دقائق</li>
                  <li>• أسعار تنافسية ومميزة</li>
                  <li>• دعم فني متاح 24/7</li>
                </ul>
                <Button 
                  className="w-full bg-orange-600 text-white hover:bg-orange-700"
                  onPress={() => handleShowOffers('pubg')}
                >
                 استكشف العروض
                </Button>
              </div>
            </div>

            {/* Free Fire Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-center">
                <div className='bg-stone-100 p-6 rounded-xl mb-4'>
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center relative">
                <Image 
                  src="/freefire.png" 
                  alt="Free Fire" 
                  fill
                  className="object-cover"
                />
              </div>
              </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">شحن Free Fire</h3>
                
                <ul className="text-sm text-gray-700 mb-6 space-y-1">
                  <li>• شحن سريع وآمن</li>
                  <li>• جميع فئات الماسات متوفرة</li>
                  <li>• عروض يومية مميزة</li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => handleShowOffers('freefire')}
                >
                    استكشف العروض
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Flexy Services Section */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaMobile className="text-3xl text-green-600" />
              <h2 className="text-3xl font-bold text-gray-800">خدمات فليكسي</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              شحن رصيد فليكسي وتفعيل باقات الإنترنت لجميع مشغلي الشبكات في الجزائر
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">شحن الرصيد</h3>
                <p className="text-gray-600">
                  شحن رصيد فليكسي فوري لجميع الشبكات (جيزي، أوريدو، موبيليس)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaWifi className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">باقات الإنترنت</h3>
                <p className="text-gray-600">
                  تفعيل باقات الإنترنت اليومية والأسبوعية والشهرية
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button className="bg-green-600 text-white hover:bg-green-700 px-8">
                تواصل معنا 
              </Button>
            </div>
          </div>
        </section>

        {/* University Notes Writing */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaGraduationCap className="text-3xl text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">كتابة المذكرات الجامعية</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              خدمات كتابة أكاديمية احترافية للطلاب الجامعيين وطلاب الدراسات العليا
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPenFancy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">البحوث الجامعية</h3>
                <p className="text-gray-600 text-sm">إعداد البحوث والرسائل الأكاديمية</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiEdit3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">المذكرات</h3>
                <p className="text-gray-600 text-sm">كتابة المذكرات والملخصات الدراسية</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUniversity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">التقارير</h3>
                <p className="text-gray-600 text-sm">إعداد التقارير المهنية والأكاديمية</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">جميع الأعمال مضمونة بجودة عالية ومراجع موثقة</p>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8">
                استفسر عن الخدمة
              </Button>
            </div>
          </div>
        </section>

        {/* Digital Online Services */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiGlobe className="text-3xl text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">الخدمات الرقمية عبر الإنترنت</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نساعدك في التسجيل في المنصات الرقمية ودفع فواتير الإنترنت والخدمات المختلفة
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserPlus className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">التسجيل في المنصات</h3>
                <p className="text-gray-600 text-sm">مساعدة في التسجيل بالمواقع والتطبيقات</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">دفع الفواتير</h3>
                <p className="text-gray-600 text-sm">دفع فواتير الإنترنت والخدمات</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSmartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">الخدمات الرقمية</h3>
                <p className="text-gray-600 text-sm">تفعيل الاشتراكات والخدمات المختلفة</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiGlobe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">استشارات تقنية</h3>
                <p className="text-gray-600 text-sm">مساعدة في استخدام الخدمات الرقمية</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">نوفر حلول رقمية شاملة لجميع احتياجاتك التقنية</p>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 px-8">
                تواصل للاستفسار
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Offers Modal */}
      <Modal 
        isOpen={showOffers} 
        onClose={handleCloseOffers}
        scrollBehavior="inside"
        placement="center"
        className="min-h-[90vh] !max-w-[90vw]"
      /*   classNames={{
    wrapper: "overflow-hidden" // Prevents wrapper scrolling
  }} */
      >
        <ModalContent className=" md:!ml-8 p-2">
          <ModalHeader className="flex flex-col gap-1 text-center">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
                {selectedGame === 'pubg' ? 'عروض شحن PUBG Mobile' : 
                 selectedGame === 'freefire' ? 'عروض شحن Free Fire' : 
                 'عروض الشحن'}
              </h2>
            </div>
          </ModalHeader>
          <ModalBody className="pb-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل العروض...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onPress={() => fetchGameProducts(selectedGame)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  إعادة المحاولة
                </Button>
              </div>
            ) : gameProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">لا توجد عروض متاحة حالياً</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameProducts.map((product) => (
               <div
  key={product.id}
  className="  group rounded-2xl  p-1.5 overflow-hidden border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-lg transition-all duration-300 bg-stone-100"
>

  <div className='relative p-2 rounded-2xl'>
  {/* Background Image with Overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center rounded-xl"
    style={{ backgroundImage: `url(${selectedGame === "freefire"?'/freefire.png':'/pubg.jpg'})`  }}
  />
  <div className="absolute rounded-xl inset-0 backdrop-blur-lg bg-gradient-to-b from-black/40 via-black/20 to-black/60 opacity-70 group-hover:opacity-60 transition-opacity duration-300" />

 {product.available ===false && <div className='absolute text-sm top-4 -left-8 -rotate-45 bg-amber-400 px-8   text-gray-950'> غير متوفر</div>}
  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center text-white">
   
    <h3 className=" text-4xl text-amber-400 drop-shadow font-bold mb-2">
      {product.coins} 
    </h3>
    <p className="text-3xl font-bold text-gray-200 drop-shadow">
      {product.price} دج
    </p>
  </div>
  </div>

  <h1 className='text-lg font-semibold text-center pt-1'>{product.name}</h1>
</div>

                ))}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ServicesPage;