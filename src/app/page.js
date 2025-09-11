"use client";

import { useState, useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import Promos from '../components/Promos.jsx';


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

const categories = [
  {
    name: 'قرطاسية',
    icon: '📝',
    count: '200+ منتج',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    name: 'إلكترونيات',
    icon: '💻',
    count: '50+ منتج',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    name: 'حقائب',
    icon: '🎒',
    count: '75+ منتج',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    name: 'مستلزمات فنية',
    icon: '🎨',
    count: '150+ منتج',
    color: 'bg-gradient-to-br from-pink-400 to-pink-600'
  }
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div dir="rtl" className="font-sans min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Hero Section */}
      <Hero />


      {/* promos Section */}


      <Promos />
    


     
    </div>
  );
}