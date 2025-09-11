'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaBox, FaTags, FaPhone, FaBook } from 'react-icons/fa';
import { useCart } from '../lib/store/hooks';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalQuantity, toggleCartDrawer } = useCart();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { key: '/', name: 'الرئيسية', href: '/', icon: <FaHome className="text-blue-500" /> },
    { key: '/products', name: 'المنتجات', href: '/products', icon: <FaBox className="text-green-600" /> },
    { key: '/services', name: 'خدمات اخرى', href: '/services', icon: <FaTags className="text-purple-600" /> },
    { key: '/contact', name: 'اتصل بنا', href: '/contact', icon: <FaPhone className="text-orange-600" /> }
  ];

  const getActiveKey = () => {
    const activeItem = navigationItems.find(item => item.href === pathname);
    return activeItem ? activeItem.key : '/';
  };

  const handleTabChange = (key) => {
    const selectedItem = navigationItems.find(item => item.key === key);
    if (selectedItem) {
      router.push(selectedItem.href);
    }
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-stone-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaBook className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex sm:flex-col ">
              <span className="text-xl font-semibold text-gray-900">مكتبة السلام</span>
              <span className="text-[11px] font-medium text-gray-900 -mt-1"> مستلزمات الدراسة</span>
            </div>
          </Link>

          {/* Desktop Navigation with Custom Tabs */}
          <div className="hidden md:flex">
            <div className="relative bg-white rounded-full px-2 py-1 flex items-center">
              {/* Sliding cursor */}
              <div
                className="absolute top-1 bottom-1 bg-stone-100 rounded-full transition-all duration-300 ease-out"
                style={{
                  right: `calc(${navigationItems.findIndex(item => item.key === getActiveKey()) * (100 / navigationItems.length)}% + 4px)`,
                  width: `calc(${100 / navigationItems.length}% - 8px)` // Subtract padding from both sides (4px each)
                }}
              />
              
              {/* Navigation items */}
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`relative cursor-pointer z-10 px-8 py-2 rounded-full transition-all duration-200 flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center  space-x-3">
            {/* Cart */}
            <button 
              onClick={toggleCartDrawer}
              className="relative p-2 cursor-pointer bg-gray-900 hover:bg-gray-700 text-white rounded-full transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalQuantity > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 pl-0"
            >
            <svg
  className="w-5 h-5 text-gray-900"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  {isMenuOpen ? (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  ) : (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  )}
</svg>

            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-y border-gray-200">
          <div className="px-6 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center  space-x-3  px-3 py-2 text-sm hover:bg-stone-100 rounded-lg duration-300"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}