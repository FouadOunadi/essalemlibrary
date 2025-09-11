import React, { useState, useEffect } from 'react'
import {Button, Card ,CardBody, CardHeader,Spinner} from '@heroui/react'
import { FaLock, FaUser, FaShoppingCart, FaBox} from 'react-icons/fa';
import OrdersManagement from './OrdersManagement';
import ProductsManagement from './ProductsManagement';
import CategoriesManagement from './CategoriesManagement';
import OffersManagement from './OffersManagement';
import { supabase } from '../../lib/supabase';


const Dashboardheader = ({handleLogout}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard statistics state
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Sample data - في التطبيق الحقيقي، ستأتي هذه البيانات من قاعدة البيانات
  const [orders] = useState([
    { id: 1, customer: 'أحمد محمد', product: 'عطر سينونا الأصلي', quantity: 2, total: '15000 دج', status: 'قيد التحضير', date: '2024-01-15' },
    { id: 2, customer: 'فاطمة علي', product: 'عطر الورد الطبيعي', quantity: 1, total: '8500 دج', status: 'تم التسليم', date: '2024-01-14' },
    { id: 3, customer: 'محمد حسن', product: 'مجموعة العطور المميزة', quantity: 1, total: '25000 دج', status: 'في الطريق', date: '2024-01-13' }
  ]);
  
  const [products, setProducts] = useState([
    { id: 1, name: 'عطر سينونا الأصلي', price: '7500 دج', stock: 25, category: 'عطور رجالية', image: '/sinouna.jpg' },
    { id: 2, name: 'عطر الورد الطبيعي', price: '8500 دج', stock: 15, category: 'عطور نسائية', image: '/perfume.jpg' },
    { id: 3, name: 'مجموعة العطور المميزة', price: '25000 دج', stock: 8, category: 'مجموعات', image: '/perfume2.jpg' }
  ]);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'عطور رجالية', icon: 'https://example.com/icons/men-perfume.png' },
    { id: 2, name: 'عطور نسائية', icon: 'https://example.com/icons/women-perfume.png' },
    { id: 3, name: 'مجموعات', icon: 'https://example.com/icons/sets.png' },
    { id: 4, name: 'عطور طبيعية', icon: 'https://example.com/icons/natural.png' }
  ]);
  
  const [offers, setOffers] = useState([
    { id: 1, title: 'خصم 20% على العطور الرجالية', description: 'خصم خاص لفترة محدودة', discount: '20%', startDate: '2024-01-01', endDate: '2024-01-31', active: true },
    { id: 2, title: 'عرض اشتري 2 واحصل على 1 مجاناً', description: 'عرض على المجموعات المختارة', discount: 'اشتري 2 احصل على 1', startDate: '2024-01-15', endDate: '2024-02-15', active: false }
  ]);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState(null);

  // Fetch dashboard statistics from Supabase
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch total orders count and revenue sum
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total');
      
      if (ordersError) {
        console.error('خطأ في جلب بيانات الطلبات:', ordersError);
      }
      
      // Fetch total products count
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('خطأ في جلب بيانات المنتجات:', error);
      }
      
      // Calculate statistics
      const totalOrders = ordersData ? ordersData.length : 0;
      const totalRevenue = ordersData ? ordersData.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0) : 0;
      const totalProducts = count || 0;
      
      setDashboardStats({
        totalOrders,
        totalProducts,
        totalRevenue
      });
      
    } catch (error) {
      console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم الإدارية</h1>
              <p className="text-gray-600 mt-2">مرحباً بك في لوحة التحكم</p>
            </div>
            <Button 
              color="danger" 
              variant="flat"
              onPress={handleLogout}
              className="font-semibold"
            >
              تسجيل الخروج
            </Button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <Button 

              variant={activeTab === 'dashboard' ? 'solid' : 'flat'}
              onPress={() => setActiveTab('dashboard')}
              className={`font-semibold  ${activeTab === 'dashboard' && ' bg-blue-500 text-white'}`}

            >
              الرئيسية
            </Button>
            <Button 
             
              variant={activeTab === 'orders' ? 'solid' : 'flat'}
              onPress={() => setActiveTab('orders')}
              className={`font-semibold  ${activeTab === 'orders' && ' bg-blue-500 text-white'}`}
              
              startContent={<FaShoppingCart />}
            >
              عرض الطلبات
            </Button>
            <Button 

              variant={activeTab === 'products' ? 'solid' : 'flat'}
              onPress={() => setActiveTab('products')}
              className={`font-semibold  ${activeTab === 'products' && ' bg-blue-500 text-white'}`}
              
              startContent={<FaBox />}
            >
              إدارة المنتجات
            </Button>
            <Button 
              
              variant={activeTab === 'categories' ? 'solid' : 'flat'}
              onPress={() => setActiveTab('categories')}
              className={`font-semibold  ${activeTab === 'categories' && ' bg-blue-500 text-white'}`}
              
              startContent={<FaLock />}
            >
              إدارة الفئات
            </Button>
            <Button 
             
              variant={activeTab === 'offers' ? 'solid' : 'flat'}
              onPress={() => setActiveTab('offers')}
              className={`font-semibold  ${activeTab === 'offers' && ' bg-blue-500 text-white'}`}
              
              startContent={<FaUser />}
            >
              إدارة العروض
            </Button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Dashboard Content */}
             {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
  <Card className="bg-white border border-gray-200 shadow-xs rounded-2xl hover:shadow-md transition">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">إجمالي الطلبات</p>
          {statsLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {dashboardStats.totalOrders}
            </p>
          )}
        </div>
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
          <FaShoppingCart className="text-blue-600 text-xl" />
        </div>
      </div>
    </CardBody>
  </Card>

  <Card className="bg-white border border-gray-200 shadow-xs rounded-2xl hover:shadow-md transition">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">عدد المنتجات</p>
          {statsLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-3xl font-bold text-green-600 mt-1">
              {dashboardStats.totalProducts}
            </p>
          )}
        </div>
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <FaBox className="text-green-600 text-xl" />
        </div>
      </div>
    </CardBody>
  </Card>

  <Card className="bg-white border border-gray-200 shadow-xs rounded-2xl hover:shadow-md transition">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
          {statsLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {dashboardStats.totalRevenue.toLocaleString()} دج
            </p>
          )}
        </div>
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
          <FaUser className="text-purple-600 text-xl" />
        </div>
      </div>
    </CardBody>
  </Card>
</div>

{/* Management Sections */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card className="bg-white border border-gray-200 shadow-xs rounded-2xl hover:shadow-md transition">
    <CardHeader className="pb-0">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaShoppingCart className="text-blue-500" /> إدارة الطلبات
      </h3>
    </CardHeader>
    <CardBody>
      <p className="text-gray-600 text-right text-sm mb-6">
        إدارة طلبات العملاء وتتبع حالات التسليم بسهولة
      </p>
      <Button  className="w-full bg-blue-500 text-white" onPress={() => setActiveTab('orders')}>
        عرض الطلبات
      </Button>
    </CardBody>
  </Card>

  <Card className="bg-white border border-gray-200 shadow-xs rounded-2xl hover:shadow-md transition">
    <CardHeader className="pb-0">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaBox className="text-green-500" /> إدارة المنتجات
      </h3>
    </CardHeader>
    <CardBody>
      <p className="text-gray-600 text-right text-sm mb-6">
        إضافة وتعديل وإدارة كتالوج المنتجات الخاص بك
      </p>
      <Button className="w-full bg-purple-500 text-white" onPress={() => setActiveTab('products')}>
        إدارة المنتجات
      </Button>
    </CardBody>
  </Card>
</div>

            </>
          )}

          {/* Orders View */}
          {activeTab === 'orders' && (
            <OrdersManagement />
          )}

          {/* Products Management */}
          {activeTab === 'products' && (
            <ProductsManagement />
          )}

          {/* Categories Management */}
           {activeTab === 'categories' && (
             <CategoriesManagement 
               categories={categories}
               setCategories={setCategories}
               editingCategory={editingCategory}
               setEditingCategory={setEditingCategory}
               newCategoryName={newCategoryName}
               setNewCategoryName={setNewCategoryName}
             />
           )}

           {/* Offers Management */}
           {activeTab === 'offers' && (
             <OffersManagement />
           )}

          
        </div>
      </div>
  )
}

export default Dashboardheader