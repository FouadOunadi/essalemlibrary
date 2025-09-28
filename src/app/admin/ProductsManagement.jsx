import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Switch, Spinner } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const ProductsManagement = ({ onOpen }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    new_price: '',
    category_id: '',
    available: true
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    price: '',
    new_price: '',
    category_id: '',
    available: true
  });
  const [uploadingImage, setUploadingImage] = useState(null);

  // Upload image to Supabase Storage
  const uploadProductImage = async (file, productId) => {
    try {
      // Check if product already has images
      const productImages = products.find(p => p.id === productId)?.images || [];
      
      // If product has images, delete the first one (primary image)
      if (productImages.length > 0) {
        await deleteProductImage(productImages[0].img, productImages[0].id);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to 'essalem' bucket
      const { data, error } = await supabase.storage
        .from('essalem')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('essalem')
        .getPublicUrl(filePath);
      
      // Add image to prod_img table
      const { data: imgData, error: imgError } = await supabase
        .from('prod_img')
        .insert({
          product_id: productId,
          img: publicUrl
        })
        .select()
        .single();

      if (imgError) {
        console.error('Error adding image to database:', imgError);
        throw imgError;
      }
      
      // Update local state
      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            images: [{ id: imgData.id, product_id: productId, img: publicUrl }, ...product.images.slice(1)],
            primaryImage: publicUrl
          };
        }
        return product;
      }));
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`خطأ في رفع الصورة: ${error.message}`);
      return null;
    }
  };

  // Delete product image from Supabase Storage
  const deleteProductImage = async (imageUrl, imageId) => {
    try {
      if (!imageUrl) return;
      
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `products/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('essalem')
        .remove([filePath]);

      if (storageError) throw storageError;
      
      // Delete from prod_img table
      if (imageId) {
        const { error: dbError } = await supabase
          .from('prod_img')
          .delete()
          .eq('id', imageId);

        if (dbError) throw dbError;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handle image change
  const handleImageChange = async (event, productId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('يرجى اختيار صورة صحيحة (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
      return;
    }

    setUploadingImage(productId);
    
    // Upload new image
    await uploadProductImage(file, productId);
    
    setUploadingImage(null);
    
    // Clear input value
    event.target.value = '';
  };

  // Delete product image
  const handleDeleteImage = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.primaryImage) return;

    setUploadingImage(productId);
    
    try {
      // Find the image record
      const imageRecord = product.images[0];
      if (imageRecord) {
        await deleteProductImage(imageRecord.img, imageRecord.id);
      }
      
      // Update local state
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          const updatedImages = p.images.slice(1);
          return {
            ...p,
            images: updatedImages,
            primaryImage: updatedImages[0]?.img || null
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('خطأ في حذف الصورة');
    } finally {
      setUploadingImage(null);
    }
  };

  // Fetch products with categories and images
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with category names
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
          .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('prod_img')
        .select('*');

      if (imagesError) throw imagesError;

      // Combine products with their images
      const productsWithImages = productsData.map(product => {
        const productImages = imagesData.filter(img => img.product_id === product.id);
        return {
          ...product,
          images: productImages,
          primaryImage: productImages[0]?.img,
          categoryName: product.categories?.name || 'غير محدد'
        };
      });

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('حدث خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    

    try {
      // Delete product images first
      const { error: imagesError } = await supabase
        .from('prod_img')
        .delete()
        .eq('product_id', productId);

      if (imagesError) throw imagesError;

      // Delete product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (productError) throw productError;

      // Update local state
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('حدث خطأ في حذف المنتج');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      new_price: product.new_price ? product.new_price.toString() : '',
      category_id: product.category_id.toString(),
      available: product.available
    });
    setIsEditModalOpen(true);
  };

  // Handle form input changes
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save edited product
  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          price: parseFloat(editForm.price),
          new_price: editForm.new_price ? parseFloat(editForm.new_price) : null,
          category_id: parseInt(editForm.category_id),
          available: editForm.available
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
      
      // Close modal
      setIsEditModalOpen(false);
      setEditingProduct(null);
 
    } catch (error) {
      console.error('Error updating product:', error);
      alert('حدث خطأ في تحديث المنتج');
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditForm({
        name: '',
        price: '',
        new_price: '',
        category_id: '',
        available: true
      });
  };

  // Open add product modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle add form input changes
  const handleAddFormChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save new product
  const handleSaveAdd = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: addForm.name,
          price: parseFloat(addForm.price),
          new_price: addForm.new_price ? parseFloat(addForm.new_price) : null,
          category_id: parseInt(addForm.category_id),
          available: addForm.available
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
      
      // Close modal and reset form
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        price: '',
        new_price: '',
        category_id: '',
        available: true
      });
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('حدث خطأ في إضافة المنتج');
    }
  };

  // Close add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      price: '',
      new_price: '',
      category_id: '',
      available: true
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardBody className="flex justify-center items-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white shadow-lg">
        <CardBody className="flex justify-center items-center py-20">
          <p className="text-red-600">{error}</p>
          <Button 
            color="primary" 
            className="mt-4"
            onPress={fetchProducts}
          >
            إعادة المحاولة
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-3 flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">إدارة المنتجات</h3>
        <Button className='bg-green-600 text-white' startContent={<FaPlus />} onPress={handleOpenAddModal}>
          إضافة منتج جديد
        </Button>
      </CardHeader>
      <CardBody>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">لا توجد منتجات متوفرة</p>
            <Button 
              color="success" 
              startContent={<FaPlus />} 
              className="mt-4"
              onPress={onOpen}
            >
              إضافة أول منتج
            </Button>
          </div>
        ) : (
          <Table aria-label="جدول المنتجات">
            <TableHeader>
              <TableColumn>الصورة</TableColumn>
              <TableColumn>اسم المنتج</TableColumn>
              <TableColumn>السعر</TableColumn>
              <TableColumn>السعر الجديد</TableColumn>
              <TableColumn>المتاح</TableColumn>
              <TableColumn>الفئة</TableColumn>
              <TableColumn>الإجراءات</TableColumn>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className='text-gray-950'>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {uploadingImage === product.id ? (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Spinner size="sm" />
                        </div>
                      ) : product.primaryImage ? (
                        <img 
                          src={product.primaryImage} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                      <div className="flex gap-1">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, product.id)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id={`image-upload-${product.id}`}
                            disabled={uploadingImage === product.id}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            isLoading={uploadingImage === product.id}
                            className="pointer-events-none"
                          >
                            <FaUpload />
                            رفع صورة
                          </Button>
                        </div>
                        {product.primaryImage && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleDeleteImage(product.id)}
                            disabled={uploadingImage === product.id}
                          >
                            <FaTrash />
                            حذف الصورة
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price} دج</TableCell>
                  <TableCell className='font-semibold text-green-600 text-lg'>{product.new_price ? `${product.new_price} دج` : '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.available ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        color="warning" 
                        variant="flat"
                        onPress={() => handleEditProduct(product)}
                      >
                        <FaEdit />
                        تعديل
                      </Button>
                      <Button 
                        size="sm" 
                        color="danger" 
                        variant="flat"
                        onPress={() => handleDeleteProduct(product.id)}
                      >
                        <FaTrash />
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
      
      {/* Edit Product Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            تعديل المنتج
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="اسم المنتج"
                placeholder="أدخل اسم المنتج"
                value={editForm.name}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
                variant="bordered"
              />
              
              <Input
                label="السعر (دج)"
                placeholder="أدخل السعر"
                type="number"
                value={editForm.price}
                onChange={(e) => handleEditFormChange('price', e.target.value)}
                variant="bordered"
              />
              
              <Input
                label="السعر الجديد (دج)"
                placeholder="أدخل السعر الجديد (اختياري)"
                type="number"
                value={editForm.new_price}
                onChange={(e) => handleEditFormChange('new_price', e.target.value)}
                variant="bordered"
              />
              
              <Select
                label="الفئة"
                placeholder="اختر الفئة"
                selectedKeys={editForm.category_id ? [editForm.category_id] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  handleEditFormChange('category_id', selectedKey);
                }}
                variant="bordered"
              >
                {categories.map((category) => (
                  <SelectItem key={category.id.toString()} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
              
              <div className="flex items-center gap-2">
                <Switch
                  isSelected={editForm.available}
                  onValueChange={(value) => handleEditFormChange('available', value)}
                  color="success"
                >
                  متوفر
                </Switch>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={handleCloseEditModal}
            >
              إلغاء
            </Button>
            <Button 
              color="primary" 
              onPress={handleSaveEdit}
              isDisabled={!editForm.name || !editForm.price || !editForm.category_id}
            >
              حفظ التغييرات
            </Button>
          </ModalFooter>
        </ModalContent>
       </Modal>
       
       {/* Add Product Modal */}
       <Modal 
         isOpen={isAddModalOpen} 
         onClose={handleCloseAddModal}
         size="2xl"
         scrollBehavior="inside"
       >
         <ModalContent>
           <ModalHeader className="flex flex-col gap-1">
             إضافة منتج جديد
           </ModalHeader>
           <ModalBody>
             <div className="flex flex-col gap-4">
               <Input
                 label="اسم المنتج"
                 placeholder="أدخل اسم المنتج"
                 value={addForm.name}
                 onChange={(e) => handleAddFormChange('name', e.target.value)}
                 variant="bordered"
               />
               
               <Input
                 label="السعر (دج)"
                 placeholder="أدخل السعر"
                 type="number"
                 value={addForm.price}
                 onChange={(e) => handleAddFormChange('price', e.target.value)}
                 variant="bordered"
               />
               
               <Input
                 label="السعر الجديد (دج)"
                 placeholder="أدخل السعر الجديد (اختياري)"
                 type="number"
                 value={addForm.new_price}
                 onChange={(e) => handleAddFormChange('new_price', e.target.value)}
                 variant="bordered"
               />
               
               <Select
                 label="الفئة"
                 placeholder="اختر الفئة"
                 selectedKeys={addForm.category_id ? [addForm.category_id] : []}
                 onSelectionChange={(keys) => {
                   const selectedKey = Array.from(keys)[0];
                   handleAddFormChange('category_id', selectedKey);
                 }}
                 variant="bordered"
               >
                 {categories.map((category) => (
                   <SelectItem key={category.id.toString()} value={category.id.toString()}>
                     {category.name}
                   </SelectItem>
                 ))}
               </Select>
               
               
               <div className="flex items-center gap-2">
                 <Switch
                   isSelected={addForm.available}
                   onValueChange={(value) => handleAddFormChange('available', value)}
                   color="success"
                 >
                   متوفر
                 </Switch>
               </div>
             </div>
           </ModalBody>
           <ModalFooter>
             <Button 
               color="danger" 
               variant="light" 
               onPress={handleCloseAddModal}
             >
               إلغاء
             </Button>
             <Button 
               color="primary" 
               onPress={handleSaveAdd}
               isDisabled={!addForm.name || !addForm.price || !addForm.category_id}
             >
               إضافة المنتج
             </Button>
           </ModalFooter>
         </ModalContent>
       </Modal>
    </Card>
  );
};

export default ProductsManagement;