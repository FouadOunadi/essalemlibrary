import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from '@heroui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const OffersManagement = () => {
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [newPromo, setNewPromo] = useState({ name: '', qte: '', price: '', product_id: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Fetch promos from Supabase
  const fetchPromos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo')
        .select(`
          *,
          products(name)
        `);
      
      if (error) {
        console.error('خطأ في جلب العروض:', error);
        return;
      }
      
      setPromos(data || []);
    } catch (error) {
      console.error('خطأ في جلب العروض:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name');
      
      if (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
    }
  };

  // Create new promo
  const createPromo = async () => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('promo')
        .insert([{
          name: newPromo.name,
          qte: parseInt(newPromo.qte),
          price: parseFloat(newPromo.price),
          product_id: newPromo.product_id
        }])
        .select(`
          *,
          products(name)
        `);
      
      if (error) {
        console.error('خطأ في إضافة العرض:', error);
        return false;
      }
      
      setPromos([...promos, ...data]);
      setNewPromo({ name: '', qte: '', price: '', product_id: '' });
      onClose();
      return true;
    } catch (error) {
      console.error('خطأ في إضافة العرض:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update promo
  const updatePromo = async (promoId, updatedData) => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('promo')
        .update(updatedData)
        .eq('id', promoId)
        .select(`
          *,
          products(name)
        `);
      
      if (error) {
        console.error('خطأ في تحديث العرض:', error);
        return false;
      }
      
      setPromos(promos.map(promo => 
        promo.id === promoId ? data[0] : promo
      ));
      setEditingPromo(null);
      return true;
    } catch (error) {
      console.error('خطأ في تحديث العرض:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete promo
  const deletePromo = async (promoId) => {
    try {
      const { error } = await supabase
        .from('promo')
        .delete()
        .eq('id', promoId);
      
      if (error) {
        console.error('خطأ في حذف العرض:', error);
        return false;
      }
      
      setPromos(promos.filter(promo => promo.id !== promoId));
      return true;
    } catch (error) {
      console.error('خطأ في حذف العرض:', error);
      return false;
    }
  };

  // Handle save promo
  const handleSavePromo = async () => {
    if (!newPromo.name || !newPromo.qte || !newPromo.price || !newPromo.product_id) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    
    await createPromo();
  };

  // Handle update promo
  const handleUpdatePromo = async () => {
    if (!editingPromo.name || !editingPromo.qte || !editingPromo.price || !editingPromo.product_id) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    
    const updatedData = {
      name: editingPromo.name,
      qte: parseInt(editingPromo.qte),
      price: parseFloat(editingPromo.price),
      product_id: editingPromo.product_id
    };
    
    await updatePromo(editingPromo.id, updatedData);
  };

  // Load data on component mount
  useEffect(() => {
    fetchPromos();
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardBody className="flex justify-center items-center p-8">
          <Spinner size="lg" />
          <p className="mr-4">جاري تحميل العروض...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-3 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800">إدارة العروض</h3>
          <Button className='bg-green-600 text-white' startContent={<FaPlus />} onPress={onOpen}>
            إضافة عرض جديد
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="جدول العروض">
            <TableHeader>
              <TableColumn>اسم العرض</TableColumn>
              <TableColumn>الكمية</TableColumn>
              <TableColumn>السعر</TableColumn>
              <TableColumn>المنتج</TableColumn>
              <TableColumn>الإجراءات</TableColumn>
            </TableHeader>
            <TableBody>
              {promos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    لا توجد عروض متاحة
                  </TableCell>
                </TableRow>
              ) : (
                promos.map((promo) => (
                  <TableRow key={promo.id} className='text-gray-950'>
                    <TableCell>{promo.name}</TableCell>
                    <TableCell>{promo.qte}</TableCell>
                    <TableCell>{promo.price} دج</TableCell>
                    <TableCell>{promo.products?.name || 'غير محدد'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          color="warning"
                          variant="flat"
                          onPress={() => setEditingPromo(promo)}
                        >
                          <FaEdit />
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat"
                          onPress={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
                              deletePromo(promo.id);
                            }
                          }}
                        >
                          <FaTrash />
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add/Edit Promo Modal */}
      <Modal isOpen={isOpen || editingPromo} onClose={() => { onClose(); setEditingPromo(null); setNewPromo({ name: '', qte: '', price: '', product_id: '' }); }} size="2xl">
        <ModalContent>
          <ModalHeader>{editingPromo ? 'تعديل العرض' : 'إضافة عرض جديد'}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="اسم العرض"
                placeholder="أدخل اسم العرض"
                value={editingPromo ? editingPromo.name : newPromo.name}
                onChange={(e) => editingPromo ? setEditingPromo({...editingPromo, name: e.target.value}) : setNewPromo({...newPromo, name: e.target.value})}
              />
              <Input
                label="الكمية"
                type="number"
                placeholder="أدخل الكمية"
                value={editingPromo ? editingPromo.qte : newPromo.qte}
                onChange={(e) => editingPromo ? setEditingPromo({...editingPromo, qte: e.target.value}) : setNewPromo({...newPromo, qte: e.target.value})}
              />
              <Input
                label="السعر"
                type="number"
                step="0.01"
                placeholder="أدخل السعر"
                value={editingPromo ? editingPromo.price : newPromo.price}
                onChange={(e) => editingPromo ? setEditingPromo({...editingPromo, price: e.target.value}) : setNewPromo({...newPromo, price: e.target.value})}
              />
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editingPromo ? editingPromo.product_id : newPromo.product_id}
                onChange={(e) => editingPromo ? setEditingPromo({...editingPromo, product_id: e.target.value}) : setNewPromo({...newPromo, product_id: e.target.value})}
              >
                <option value="">اختر المنتج</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => { onClose(); setEditingPromo(null); setNewPromo({ name: '', qte: '', price: '', product_id: '' }); }}>
              إلغاء
            </Button>
            <Button 
              color="primary" 
              onPress={editingPromo ? handleUpdatePromo : handleSavePromo}
              isLoading={saving}
            >
              {editingPromo ? 'تحديث' : 'حفظ'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OffersManagement;