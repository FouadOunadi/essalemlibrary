import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Spinner } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaSave, FaTimes } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadingIcon, setUploadingIcon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // دالة رفع الأيقونة إلى Supabase Storage
  const uploadIcon = async (file, categoryId) => {
    try {
      // البحث عن الفئة الحالية للتحقق من وجود أيقونة
      const currentCategory = categories.find(cat => cat.id === categoryId);
      
      // إذا كانت الفئة تحتوي على أيقونة، احذف الأيقونة القديمة أولاً
      if (currentCategory && currentCategory.icon) {
        await deleteIcon(currentCategory.icon);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${categoryId}_${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      // رفع الملف إلى bucket essalem
      const { data, error } = await supabase.storage
        .from('essalem')
        .upload(filePath, file);

      if (error) {
        console.error('تفاصيل خطأ الرفع:', error);
        throw error;
      }

      // الحصول على URL العام للصورة
      const { data: { publicUrl } } = supabase.storage
        .from('essalem')
        .getPublicUrl(filePath);
      
      // Update the category icon in Supabase
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .update({ icon: publicUrl })
        .eq('id', categoryId);

      if (categoryError) {
        console.error('Error updating category icon:', categoryError);
        throw categoryError;
      }

      // تحديث الواجهة مباشرة بعد الرفع الناجح
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? {...cat, icon: publicUrl} : cat
      ));
      
      return publicUrl;
    } catch (error) {
      console.error('خطأ في رفع الأيقونة:', error);
      alert(`خطأ في رفع الصورة: ${error.message}`);
      return null;
    }
  };

  // دالة حذف الأيقونة من Supabase Storage
  const deleteIcon = async (iconUrl) => {
    try {
      if (!iconUrl) return;
      
      // استخراج مسار الملف من URL
      const urlParts = iconUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `categories/${fileName}`;

      const { error } = await supabase.storage
        .from('essalem')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('خطأ في حذف الأيقونة:', error);
    }
  };

  // جلب جميع الفئات من قاعدة البيانات
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('خطأ في جلب الفئات:', error);
      } else {
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الفئات:', error);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء فئة جديدة
  const createCategory = async (name, icon = null) => {
    try {
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([
          {
            name: name.trim(),
            icon: icon || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('خطأ في إنشاء الفئة:', error);
        return null;
      }

      // إضافة الفئة الجديدة إلى الحالة المحلية
      setCategories(prevCategories => [newCategory, ...prevCategories]);
      
      return newCategory;
    } catch (error) {
      console.error('خطأ في إنشاء الفئة:', error);
      return null;
    }
  };

  // تحديث فئة
const updateCategory = async (id, name) => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        name: name.trim()
      })
      .eq('id', id);

    if (error) {
      console.error('خطأ في تحديث الفئة:', error);
      return false;
    }

    // Update local state with new name
    setCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === id ? {...cat, name: name.trim()} : cat
      )
    );
    
    return true;
  } catch (error) {
    console.error('خطأ في تحديث الفئة:', error);
    return false;
  }
};
  
  // حذف فئة
  const deleteCategoryFromDB = async (id) => {
    try {
      // الحصول على بيانات الفئة قبل الحذف
      const { data: existingCategory, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingCategory) {
        console.error('الفئة غير موجودة:', fetchError);
        return null;
      }

      // حذف الفئة
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('خطأ في حذف الفئة:', deleteError);
        return null;
      }

      // إزالة الفئة من الحالة المحلية
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== id)
      );
      
      return existingCategory;
    } catch (error) {
      console.error('خطأ في حذف الفئة:', error);
      return null;
    }
  };

  // جلب الفئات عند تحميل المكون
  useEffect(() => {
    fetchCategories();
  }, []);

 
  const handleSaveCategory = async (categoryId) => {
    if (!newCategoryName.trim()) return;
    
    setSaving(true);
    const success = await updateCategory(categoryId, newCategoryName);
    
    if (success) {
      setEditingCategory(null);
      setNewCategoryName('');
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setNewCategoryName(category.name);
  };

  const handleDeleteCategory = async (categoryId) => {
    // إضافة تأكيد قبل الحذف
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      return; // إلغاء الحذف إذا ضغط المستخدم على إلغاء
    }
    
    setDeleting(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category && category.icon) {
      // حذف الأيقونة من Supabase Storage أولاً
      await deleteIcon(category.icon);
    }
    
    // ثم حذف الفئة من قاعدة البيانات
    await deleteCategoryFromDB(categoryId);
    setDeleting(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return null;
    
    setSaving(true);
    const result = await createCategory(newCategoryName);
    if (result) {
      setNewCategoryName('');
    }
    setSaving(false);
    return result;
  };

  // دالة تغيير الأيقونة مع التحقق من الملف
  const handleIconChange = async (event, categoryId) => {
    const file = event.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('يرجى اختيار صورة صحيحة (JPEG, PNG, GIF, WebP)');
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
      return;
    }

    setUploadingIcon(categoryId);
    
    // رفع الأيقونة الجديدة
    await uploadIcon(file, categoryId);
    
    setUploadingIcon(null);
    
    // مسح قيمة input file
    event.target.value = '';
  };

  // دالة حذف الأيقونة من الفئة
  const handleDeleteIcon = async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category || !category.icon) return;

    setUploadingIcon(categoryId);
    
    try {
      // حذف الأيقونة من التخزين
      await deleteIcon(category.icon);
      
      // تحديث الفئة في قاعدة البيانات لإزالة الأيقونة
      const { error } = await supabase
        .from('categories')
        .update({ icon: null })
        .eq('id', categoryId);

      if (error) {
        console.error('خطأ في تحديث الفئة:', error);
        alert('خطأ في حذف الأيقونة');
        return;
      }

      // تحديث الحالة المحلية
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? {...cat, icon: null} : cat
      ));
      
    } catch (error) {
      console.error('خطأ في حذف الأيقونة:', error);
      alert('خطأ في حذف الأيقونة');
    } finally {
      setUploadingIcon(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardBody>
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <span className="mr-3 text-gray-600">جاري تحميل الفئات...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-3 flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">إدارة الفئات</h3>
      </CardHeader>
      <CardBody>
        {/* نموذج إضافة فئة جديدة */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">إضافة فئة جديدة</h3>
          <div className="flex items-center gap-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="اسم الفئة الجديدة"
              className="flex-1"
            />
            <Button
              
              startContent={saving ? <Spinner size="sm" /> : <FaPlus />}
              onPress={handleAddCategory}
              isDisabled={saving || !newCategoryName.trim()}
              isLoading={saving}
              className=' bg-green-600  text-white'
            >
              إضافة
            </Button>
          </div>
        </div>

        <Table aria-label="جدول الفئات">
          <TableHeader>
            <TableColumn>الأيقونة</TableColumn>
            <TableColumn>اسم الفئة</TableColumn>
            <TableColumn>الإجراءات</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"لا توجد فئات حالياً"}>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {uploadingIcon === category.id ? (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Spinner size="sm" />
                      </div>
                    ) : category.icon ? (
                      <img src={category.icon} alt={category.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">لا توجد</span>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleIconChange(e, category.id)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id={`icon-upload-${category.id}`}
                          disabled={uploadingIcon === category.id}
                        />
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          isLoading={uploadingIcon === category.id}
                          className="pointer-events-none"
                        >
                          <FaUpload />
                          رفع صورة
                        </Button>
                      </div>
                      {category.icon && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleDeleteIcon(category.id)}
                          disabled={uploadingIcon === category.id}
                        >
                          <FaTrash />
                          حذف الصورة
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {editingCategory === category.id ? (
                    <Input 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="اسم الفئة"
                      size="sm"
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {editingCategory === category.id ? (
                      <>
                        <Button 
                          size="sm" 
                          color="success" 
                          variant="flat" 
                          startContent={!saving && <FaSave />}
                          onPress={() => handleSaveCategory(category.id)}
                          isLoading={saving}
                          isDisabled={saving}
                        >
                          حفظ
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat" 
                          startContent={<FaTimes />}
                          onPress={handleCancelEdit}
                          isDisabled={saving}
                        >
                          إلغاء
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          color="warning" 
                          variant="flat" 
                          startContent={<FaEdit />}
                          onPress={() => handleEditCategory(category)}
                          isDisabled={deleting === category.id || uploadingIcon === category.id}
                        >
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat" 
                          startContent={deleting !== category.id && <FaTrash />}
                          onPress={() => handleDeleteCategory(category.id)}
                          isLoading={deleting === category.id}
                          isDisabled={deleting === category.id || uploadingIcon === category.id}
                        >
                          حذف
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default CategoriesManagement;