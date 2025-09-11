'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, Tab } from "@nextui-org/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { key: '/', name: 'الرئيسية', href: '/', icon: '🏠' },
    { key: '/products', name: 'المنتجات', href: '/products', icon: '📦' },
    { key: '/services', name: 'خدمات اخرى', href: '/services', icon: '🏷️' },
    { key: '/contact', name: 'اتصل بنا', href: '/contact', icon: '📞' }
  ];

  const getActiveKey = () => {
    const activeItem = navigationItems.find(item => item.href === pathname);
    return activeItem ? activeItem.key : '/';
  };

  return (
    <motion.nav 
      className="fixed w-full z-50 top-0 border-b border-gray-200 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        backgroundColor: isScrolled ? 'rgba(249, 250, 251, 0.95)' : 'rgb(249, 250, 251)',
        boxShadow: isScrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
      }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <motion.div 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-xl flex items-center justify-center"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <motion.svg 
                className="w-3 h-3 sm:w-6 sm:h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex sm:flex-col"
            >
              <motion.span 
                className="text-lg sm:text-xl font-bold text-gray-800"
                whileHover={{ scale: 1.05 }}
              >
                مكتبة السلام
              </motion.span>
              <span className='text-[11px] font-medium -mt-1 text-gray-600'>
                مستلزمات مدرسية
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation with Hero UI Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden xl:flex"
          >
            <Tabs 
              selectedKey={getActiveKey()}
              variant="light"
              size="lg"
              radius="full"
              classNames={{
                base: "bg-gray-100 p-1 rounded-full",
                tabList: "gap-2 bg-transparent",
                cursor: "bg-white shadow-md",
                tab: "px-6 py-2 text-sm font-medium",
                tabContent: "group-data-[selected=true]:text-gray-800 text-gray-600"
              }}
            >
              {navigationItems.map((item) => (
                <Tab 
                  key={item.key} 
                  title={
                    <Link 
                      href={item.href}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  }
                />
              ))}
            </Tabs>
          </motion.div>

          {/* Tablet Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex xl:hidden items-center"
          >
            <div className="bg-gray-100 rounded-full p-1 flex items-center space-x-1 space-x-reverse">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className={`relative p-3 rounded-full transition-all duration-300 flex items-center ${
                      pathname === item.href
                        ? 'text-gray-800 bg-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                    title={item.name}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 space-x-reverse flex-shrink-0"
          >
            {/* Cart */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button 
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300"
              aria-label="قائمة التنقل"
            >
              <div className="relative w-5 h-5">
                <motion.span 
                  animate={{ 
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 6 : 0
                  }}
                  className="absolute h-0.5 w-5 bg-current block transform origin-center" 
                  style={{ top: '0px' }}
                />
                <motion.span 
                  animate={{ opacity: isMenuOpen ? 0 : 1 }}
                  className="absolute h-0.5 w-5 bg-current block top-[8px]"
                />
                <motion.span 
                  animate={{ 
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -6 : 0
                  }}
                  className="absolute h-0.5 w-5 bg-current block transform origin-center"
                  style={{ top: '16px' }}
                />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="md:hidden overflow-hidden"
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="px-4 pt-2 pb-6 bg-gray-50 backdrop-blur-sm border-t border-gray-200">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-gray-800 bg-white shadow-sm transform scale-[1.02] border border-gray-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <motion.span 
                    className="text-lg"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span>{item.name}</span>
                  {pathname === item.href && (
                    <motion.div 
                      className="mr-auto w-2 h-2 bg-gray-800 rounded-full"
                      layoutId="mobileActiveIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}