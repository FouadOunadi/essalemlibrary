import React, { useState, useEffect, useRef } from "react";
import library3 from "../../public/bg3.png";
import blob from "../../public/bbblurry4.svg";

import freefire from "../../public/freefire.png"
import flexy from "../../public/flexy.png"
import perfume2 from "../../public/perfume2.jpg"
import adawat from "../../public/adawat.jpg"


import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import {FaPhone, FaEnvelope } from "react-icons/fa6";

import {FaInstagram, FaFacebook , FaWhatsapp} from "react-icons/fa"

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Services array with icons and descriptions
  const services = [
    { icon: "📚", text: "جميع المستلزمات المدرسية والجامعية" },
    { icon: "✏️", text: "اللوازم المكتبية" },
    { icon: "🖨️", text: "طباعة، نسخ وتغليف" },
    { icon: "🧴", text: "منتجات العناية اليومية و عطور" },
    { icon: "🎓", text: "خدمات الطلبة و المشاريع الجامعية" },
    { icon: "🌐", text: "الخدمات الرقمية  عبر الإنترنت" }
  ];
  
  const slides = [
    {
      id: 1,
      title: "شحن الألعاب و الخدمات الرقمية عبر الإنترنت",
      subtitle: "اشحن رصيدك بسهولة وأمان",
      description: "اشحن ألعابك وخدماتك الرقمية بسهولة مع أفضل العروض المتاحة",
      bgColor: "from-gray-700/60 via-gray-900/60 to-red-600/60",
      image: freefire,
    },
    {
      id: 2,
      title: "جميع المستلزمات المدرسية و الجامعية",
      subtitle: "أفضل العروض وأسعار تنافسية",
      description: "اكتشف تشكيلة شاملة من المستلزمات الدراسية والجامعية لتلبية جميع احتياجاتك",
      bgColor: "from-gray-900/60 via-gray-800/50 to-black/60",
      image: adawat,
    },
    {
      id: 3,
      title: "فليكسي وشحن الإنترنت",
      subtitle: "كل خدمات الاتصالات في مكان واحد",
      description: "اشحن رصيدك للهاتف المحمول وجدد اشتراكات الإنترنت المنزلي بسهولة وأمان",
      bgColor: "from-gray-900/60 via-gray-800/50 to-black/60",
      image: flexy,
    },
    {
      id: 4,
      title: "منتجات العناية والعطور",
      subtitle: "أناقة وانتعاش كل يوم",
      description: "اكتشف مجموعة متنوعة من منتجات العناية اليومية والعطور لانتعاش يدوم طوال اليوم",
      bgColor: "from-gray-900/60 via-gray-800/50 to-black/60",
      image: perfume2,
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      {/* Desktop Layout - Original Grid */}
      <div className="hidden lg:grid grid-cols-3 grid-rows-2  gap-4 h-[calc(100vh-4rem)] p-6">
        {/* First class: 1 column, 2 rows - Modern UI/UX Design */}
        <div className="col-span-1 row-span-2 bg-white p-2  rounded-3xl transition-all duration-300 group flex flex-col">
          {/* Image Section */}
          <div className="flex flex-col w-full h-[48%] rounded-2xl relative overflow-hidden transition-shadow duration-300">
            <Image
              src={blob}
              alt="Background blob"
              fill
              className="object-cover rounded-2xl opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-slate-800/5 to-transparent"></div>

            {/* Centered Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col h-[8rem] items-center justify-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  مكتبة السلام
                </h1>
                <h1 className="text-2xl font-bold text-gray-700 relative group">
                  <span className="relative">ترحب بكم</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1  p-3 flex flex-col">
            
              {/* Services List */}
              <div className=" flex-1 space-y-3 mb-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-lg">{service.icon}</span>
                    <span className="text-md text-gray-700 font-md leading-relaxed">{service.text}</span>
                  </div>
                ))}
              </div>
            
             <Link href="/services" className="block  justify-self-end">
            <Button className="bg-gray-900 rounded-full  text-white w-full">
              استكشف المزيد
            </Button>
          </Link>
          </div>
        </div>

        {/* Second class: Modern Slider - 2 columns, 1 row */}
        <div className="col-span-2 row-span-1 rounded-3xl overflow-hidden relative group">
          {/* Slider Container */}
          <div className="relative w-full h-full " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0  ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
              >
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor}`}></div>
<div className="relative z-10 w-full h-full flex items-center justify-between py-8  lg:px-10 text-white">
                  {/* Content */}
                  <div className=" space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">
                        {slide.title}
                      </h3>
                      <p className="text-xl opacity-90">
                        {slide.subtitle}
                      </p>
                      <p className="text-sm opacity-75 max-w-lg">
                        {slide.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-white"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div onClick={nextSlide} className="z-40 absolute cursor-pointer left-0 top-0 h-full w-18 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 duration-300">
            <span className="w-10 h-10 cursor-pointer bg-white/30 rounded-full flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
              </svg>
            </span>
          </div>

          <div onClick={prevSlide} className="z-40 absolute cursor-pointer right-0 top-0 h-full w-18 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 duration-300">
            <span className="w-10 h-10 cursor-pointer bg-white/30 rounded-full flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6-6-6-1.41 1.41z" />
              </svg>
            </span>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Third class: Location - 1 column, 1 row */}
        <a 
          href="https://maps.app.goo.gl/DL3cPdDZV6eXcBHn6" 
          target="_blank" 
          rel="noopener noreferrer"
          className="col-span-1 row-span-1 border border-gray-200  bg-white p-1 rounded-3xl overflow-hidden"
        >
          <div className="group w-full h-full relative rounded-[20px] overflow-hidden">
            <Image
              src="/location.png"
              alt="location"
              fill
              className="object-cover group-hover:scale-105 rounded-[20px] transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-800/20 to-transparent"></div>
            <div
              className="absolute inset-0 rounded-[18px] backdrop-blur-sm"
              style={{
                maskImage:
                  "radial-gradient(circle at center, transparent 60px, black 100px)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, transparent 60px, black 80px)",
              }}
            ></div>
            
            <div className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="group bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-700"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-white text-sm font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                موقعنا
              </span>
            </div>
          </div>
        </a>

        {/* Fourth class: Contact Info - 1 column, 1 row */}
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-slate-50 to-white rounded-3xl relative overflow-hidden border border-gray-200  group">
          <div className="absolute inset-1 rounded-[20px] overflow-hidden">
            <Image
              src={library3}
              alt="essalemShop"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/40 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]"></div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center px-6 space-y-3">
              {/* Phone Number */}
              <div className="group/item relative">
                <div className="flex items-center rounded-2xl space-x-4 bg-white/5 backdrop-blur-xl p-2 hover:bg-white/15 transition-all duration-500 border border-white/10 hover:border-white/30 hover:scale-[1.02]">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg group-hover/item:shadow-xl group-hover/item:bg-white/30 transition-all duration-300">
                    <FaPhone className="text-white text-sm drop-shadow-sm" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-white/90 font-semibold text-sm  mb-1 drop-shadow-sm">الهاتف</p>
                    <p className="text-white/75 text-xs font-medium tracking-wider font-mono">0658744115/0668674585</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Email */}
              <div className="group/item relative">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=essalemlibrary@gmail.com" target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl rounded-2xl p-2 hover:bg-white/15 transition-all duration-500 border border-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg group-hover/item:shadow-xl group-hover/item:bg-white/30 transition-all duration-300">
                      <FaEnvelope className="text-white text-sm drop-shadow-sm" />
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-white/90 font-semibold text-sm mb-1 drop-shadow-sm">البريد الإلكتروني</p>
                      <p className="text-white/75 text-xs font-medium tracking-wider font-mono">essalemlibrary@gmail.com</p>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="flex justify-center w-full space-x-3">
                <div className="group/social relative flex-1">
                  <a href="https://www.instagram.com/essalemlibrary/?hl=fr" target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center w-full justify-center h-13 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30 hover:scale-110 cursor-pointer">
                      <span className="ml-2 text-gray-200">essalemlibrary/</span>
                      <FaInstagram className="text-gray-200 text-lg drop-shadow-sm" />
                    </div>
                  </a>
                </div>
                
                <div className="group/social relative flex-1">
                <a  href='https://wa.me/0660025759' target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center justify-center w-full h-13 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30 hover:scale-110 cursor-pointer">
                    <span className="ml-2 text-gray-200">essalemlibrary</span>
                    <FaWhatsapp className="text-gray-200 text-lg drop-shadow-sm" />
                  </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Stacked */}
      <div className="lg:hidden flex flex-col space-y-4 p-4" dir="rtl">

         {/* Slider Section - Mobile */}
        <div className="h-48 md:h-80 rounded-3xl overflow-hidden relative ">
          <div className="relative w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor}`}></div>
                
                <div className="relative z-10 w-full h-full flex items-center p-4 px-14 md:p-6 text-white">
                  <div className="w-full space-y-2 md:space-y-4">
                    <h3 className="text-lg md:text-2xl font-bold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-sm md:text-lg opacity-90">
                      {slide.subtitle}
                    </p>
                    <p className="text-xs md:text-sm opacity-75">
                      {slide.description}
                    </p>
                   {/*  <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full text-xs md:text-sm">
                      اعرف المزيد
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div onClick={nextSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </div>

          <div onClick={prevSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6-6-6-1.41 1.41z" />
            </svg>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Header/Welcome Section - Mobile */}
        <div className="bg-white p-4 rounded-3xl">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
            <Image
              src={blob}
              alt="Background blob"
              fill
              className="object-cover rounded-2xl opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-slate-800/5 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                  مكتبة السلام
                </h1>
                <h2 className="text-2xl md:text-2xl font-bold text-gray-700 ">
                  ترحب بكم
                </h2>
              </div>
            </div>
          </div>
          
          {/* Services Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 ">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                <span className="text-lg">{service.icon}</span>
                <span className="text-sm md:text-md text-gray-700 font-medium leading-relaxed">{service.text}</span>
              </div>
            ))}
          </div>
          
          <Link href="/services" className="block">
            <Button className="bg-gray-900 rounded-full text-white w-full">
              استكشف المزيد
            </Button>
          </Link>
        </div>

       

        {/* Location & Contact - Mobile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          
          {/* Location Card */}
          <a 
            href="https://maps.app.goo.gl/DL3cPdDZV6eXcBHn6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-1 rounded-3xl overflow-hidden h-48 border border-stone-200"
          >
            <div className="group w-full h-full relative rounded-[20px] overflow-hidden">
              <Image
                src="/location.png"
                alt="location"
                fill
                className="object-cover group-hover:scale-105 rounded-[20px] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-800/20 to-transparent"></div>
              <div
                className="absolute inset-0 rounded-[20px] backdrop-blur-sm"
                style={{
                  maskImage: "radial-gradient(circle at center, transparent 40px, black 60px)",
                  WebkitMaskImage: "radial-gradient(circle at center, transparent 40px, black 60px)",
                }}
              ></div>
              
              <div className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  موقعنا
                </span>
              </div>
            </div>
          </a>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl relative overflow-hidden border border-stone-200 group h-48">
            <div className="absolute inset-1 rounded-[20px] overflow-hidden">
              <Image
                src={library3}
                alt="essalemShop"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/40 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-center p-3 space-y-2">
              {/* Phone */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-xl p-2 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <FaPhone className="text-white text-xs" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-white text-xs mb-1">الهاتف</p>
                  <p className="text-white/75 text-xs font-mono">0658744115</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-xl p-2 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-white text-xs" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-white text-xs  mb-1">الإيميل</p>
                  <p className="text-white/75 text-xs font-mono">essalemlibrary@gmail.com</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-2">
                <a href="https://www.instagram.com/essalemlibrary/?hl=fr" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <div className="flex items-center justify-center h-8 bg-white/10 backdrop-blur-xl rounded-lg hover:bg-white/20 transition-all duration-300">
                    <FaInstagram className="text-white text-sm" />
                  </div>
                </a>
                <div className="flex-1">
                  <div className="flex items-center justify-center h-8 bg-white/10 backdrop-blur-xl rounded-lg hover:bg-white/20 transition-all duration-300">
                    <FaFacebook className="text-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;