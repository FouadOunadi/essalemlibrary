import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { addItem, updateQuantity, removeFromCart as removeFromCartAction, clearCart, toggleCart } from './cartSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector= useSelector;

// Custom cart hooks
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  
  const addToCart = (item) => {
    dispatch(addItem(item));
  };
  
  const removeFromCart = (id) => {
    dispatch(removeFromCartAction(id));
  };
  
  const updateItemQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const clearAllItems = () => {
    dispatch(clearCart());
  };
  
  const toggleCartDrawer = () => {
    dispatch(toggleCart());
  };
  
  return {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
    isOpen: cart.isOpen,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearAllItems,
    toggleCartDrawer,
  };
};