import { useDispatch, useSelector } from 'react-redux';
import { 
  setPromos,
  addItem, 
  updateQuantity, 
  removeFromCart as removeFromCartAction, 
  clearCart, 
  toggleCart,
  closeCart
} from './cartSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  
  const loadPromos = (promos) => {
    dispatch(setPromos(promos));
  };
  
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
  
  const closeCartDrawer = () => {
    dispatch(closeCart());
  };
  
  // Helper function to get promo info for display
  const getItemPromoInfo = (itemId, quantity) => {
    const item = cart.items.find(i => i.id === itemId);
    if (!item) return null;
    
    const promo = cart.promos.find(p => p.product_id === itemId);
    if (!promo) return null;
    
    // Get the regular price (new_price if available, otherwise price)
    const regularPrice = (item.new_price && item.new_price !== 0) ? item.new_price : item.price;
    
    const promoBundles = Math.floor(quantity / promo.qte);
    const remainingItems = quantity % promo.qte;
    
    // Calculate savings properly
    const regularTotal = regularPrice * quantity;
    const promoTotal = (promoBundles * promo.price) + (remainingItems * regularPrice);
    const savings = regularTotal - promoTotal;
    
    return {
      promo,
      promoBundles,
      remainingItems,
      savings: savings > 0 ? savings : 0,
      regularPrice,
      regularTotal,
      promoTotal
    };
  };
  
  return {
    items: cart.items,
    promos: cart.promos,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
    regularTotalAmount: cart.regularTotalAmount,
    totalSavings: cart.totalSavings,
    isOpen: cart.isOpen,
    loadPromos,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearAllItems,
    toggleCartDrawer,
    closeCartDrawer,
    getItemPromoInfo,
  };
};