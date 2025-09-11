'use client';
import React, { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Dashboard from './Dashboard';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Please enter password');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('تم تسجيل الدخول بنجاح');
        setIsAuthenticated(true);
      } else {
        toast.error(data.message || 'كلمة المرور غير صحيحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  if (isAuthenticated) {
    return (
        <Dashboard handleLogout={handleLogout} />
      
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="container mx-auto px-4 flex items-center justify-center ">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FaLock className="text-2xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">بوابة الإدارة</h1>
            </div>
            
            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">
                    كلمة مرور المدير
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="أدخل كلمة المرور الآمنة"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      endContent={
                        <button
                          className="focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <FaEyeSlash className="text-xl text-gray-500" />
                          ) : (
                            <FaEye className="text-xl text-gray-500" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      size="lg"
                      className="text-lg"
                      classNames={{
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
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg"
                  isLoading={isLoading}
                  disabled={isLoading}
                  startContent={<FaLock className="text-lg" />}
                >
                  <span>الوصول إلى لوحة الإدارة</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;