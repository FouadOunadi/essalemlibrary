"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    name: 'حقيبة مدرسية',
    price: 49.99,
    originalPrice: 69.99,
    image: '/backpack.jpg',
    description: 'حقيبة متينة مع جيوب متعددة',
    category: 'حقائب',
    rating: 4.8,
    badge: 'الأكثر شعبية'
  },
  {
    id: 2,
    name: 'آلة حاسبة علمية',
    price: 19.99,
    originalPrice: 24.99,
    image: '/calculator.jpg',
    description: 'آلة حاسبة متقدمة للرياضيات والعلوم',
    category: 'إلكترونيات',
    rating: 4.9,
    badge: 'الأكثر مبيعاً'
  },
  {
    id: 3,
    name: 'مجموعة دفاتر',
    price: 12.99,
    originalPrice: 16.99,
    image: '/notebooks.jpg',
    description: 'مجموعة من 5 دفاتر مسطرة',
    category: 'قرطاسية',
    rating: 4.7,
    badge: 'جديد'
  },
  {
    id: 4,
    name: 'أقلام ملونة',
    price: 8.99,
    originalPrice: 12.99,
    image: '/pencils.jpg',
    description: 'أقلام ملونة عالية الجودة للمشاريع الفنية',
    category: 'مستلزمات فنية',
    rating: 4.6,
    badge: 'تخفيض'
  },
];

const sliderImages = [
  {
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'عروض خاصة',
    title: 'عروض حصرية',
    subtitle: 'اكتشف أفضل العروض والخصومات المميزة',
    cta: 'تسوق العروض',
    gradient: 'from-violet-600/80 via-purple-600/80 to-indigo-600/80'
  },
  {
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80',
    alt: 'تخفيضات العودة للمدرسة',
    title: 'مجموعة العودة للمدرسة',
    subtitle: 'كل ما تحتاجه لعام دراسي ناجح',
    cta: 'تسوق المجموعة',
    gradient: 'from-blue-600/80 via-cyan-600/80 to-teal-600/80'
  },
  {
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'وصل حديثاً',
    title: 'مستلزمات فنية مميزة',
    subtitle: 'أطلق إبداعك مع مواد احترافية عالية الجودة',
    cta: 'اكتشف الفن',
    gradient: 'from-emerald-600/80 via-green-600/80 to-lime-600/80'
  },
  {
    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'إلكترونيات',
    title: 'أدوات دراسة ذكية',
    subtitle: 'تقنية تعزز التعلم والإنتاجية',
    cta: 'تسوق التقنيات',
    gradient: 'from-orange-600/80 via-red-600/80 to-pink-600/80'
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <section className="min-h-screen bg-stone-100 px-4 sm:px-6 lg:px-8 pt-6 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  h-[80vh] max-h-[100vh]">
          
          {/* Main Hero Slider */}
          <div 
            className="lg:col-span-3 order-1 lg:order-2 relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 border border-white/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative h-full">
              {sliderImages.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                >
                  <div className="relative h-full">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover transition-transform duration-1000 hover:scale-110"
                      priority={index === 0}
                    />
                    
                    {/* Dynamic gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000`} />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6 sm:p-8 lg:p-12 z-20">
                      <div className="max-w-2xl transform transition-all duration-700 hover:scale-105">
                        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            {slide.title}
                          </h1>
                          <p className="text-lg sm:text-xl lg:text-2xl mb-6 lg:mb-8 text-white/90 leading-relaxed">
                            {slide.subtitle}
                          </p>
                          <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 bg-white/90 hover:bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-1"
                          >
                            {slide.cta}
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Enhanced Navigation arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white p-4 rounded-2xl transition-all duration-300 z-30 hover:scale-110 focus:ring-4 focus:ring-white/30"
                aria-label="الشريحة السابقة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white p-4 rounded-2xl transition-all duration-300 z-30 hover:scale-110 focus:ring-4 focus:ring-white/30"
                aria-label="الشريحة التالية"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              

            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl">
            <div 
              style={{
     /*            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80)', */
                 backgroundImage: 'url(/bg2.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} 
              className="relative h-full flex flex-col text-white"
            >
              {/* Dark overlay with #13B3F2 accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-[#13B3F2]/60" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-center">
               
                
                {/* CTA Button */}
                {/* <div className="mt-6 space-y-3">
                  <Link 
                    href="/contact" 
                    className="group w-full bg-[#13B3F2] hover:bg-[#13B3F2]/90 text-white text-center font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    تواصل معنا
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                  
                  <Link 
                    href="/products" 
                    className="group w-full bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white text-center font-bold py-3 rounded-2xl transition-all duration-300 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
                  >
                    تسوق الآن
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                    </svg>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}