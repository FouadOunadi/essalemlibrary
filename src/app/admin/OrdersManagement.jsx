import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { FaTrash, FaEye } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('خطأ في جلب الطلبات:', error);
        return;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) {
        console.error('خطأ في حذف الطلب:', error);
        alert('حدث خطأ في حذف الطلب');
        return;
      }
      
      setOrders(orders.filter(order => order.id !== orderId));
     
    } catch (error) {
      console.error('خطأ في حذف الطلب:', error);
      alert('حدث خطأ في حذف الطلب');
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardBody className="flex justify-center items-center p-8">
          <Spinner size="lg" />
          <p className="mr-4">جاري تحميل الطلبات...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-3">
          <h3 className="text-2xl font-semibold text-gray-800">إدارة الطلبات</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="جدول الطلبات">
            <TableHeader>
              <TableColumn>رقم الطلب</TableColumn>
              <TableColumn>اسم العميل</TableColumn>
              <TableColumn>رقم الهاتف</TableColumn>
              <TableColumn>المجموع</TableColumn>
              <TableColumn>الملاحظات</TableColumn>
              <TableColumn>الإجراءات</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    لا توجد طلبات متاحة
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className='text-gray-950'>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell>{order.total} دج</TableCell>
                    <TableCell>{order.notes || 'لا توجد ملاحظات'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          color="primary" 
                          variant="flat"
                          onPress={() => viewOrderDetails(order)}
                        >
                          <FaEye />
                          عرض
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat"
                          onPress={() => deleteOrder(order.id)}
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

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <ModalHeader>تفاصيل الطلب #{selectedOrder?.id}</ModalHeader>
          <ModalBody>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>اسم العميل:</strong> {selectedOrder.customer_name}
                  </div>
                  <div>
                    <strong>رقم الهاتف:</strong> {selectedOrder.phone}
                  </div>
                  <div>
                    <strong>المجموع:</strong> {selectedOrder.total} دج
                  </div>
                  <div>
                    <strong>الملاحظات:</strong> {selectedOrder.notes || 'لا توجد ملاحظات'}
                  </div>
                </div>
                
                {selectedOrder.details && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">تفاصيل المنتجات:</h4>
                    <div className="max-h-64 overflow-y-auto border border-gray-200  rounded-xl">
                      <Table aria-label="تفاصيل المنتجات" removeWrapper classNames={{base: "rounded-none"}}>
                        <TableHeader>
                          <TableColumn>المنتج</TableColumn>
                          <TableColumn>السعر</TableColumn>
                          <TableColumn>الكمية</TableColumn>
                          <TableColumn>المجموع</TableColumn>
                          <TableColumn>التوفير</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.details.items?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.price} دج</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.promoTotal} دج</TableCell>
                              <TableCell>
                                {item.savings > 0 ? (
                                  <span className="text-green-600">-{item.savings} دج</span>
                                ) : (
                                  <span className="text-gray-500">0 دج</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )) || []}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {selectedOrder.details.totalSavings > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <strong className="text-green-700">
                          إجمالي التوفير: {selectedOrder.details.totalSavings} دج
                        </strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrdersManagement;