import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  promos: [], // Store promo rules from your database
  totalQuantity: 0,
  totalItems: 0,
  totalAmount: 0, // Final amount with promos applied
  regularTotalAmount: 0, // Total without any promos
  totalSavings: 0, // Total savings from all promos
  isOpen: false,
};

// Helper function to calculate both regular and promo prices
const calculateItemPricing = (item, promos) => {
  // Check if new_price exists and is less than price, use it for calculation
  // otherwise use the regular price
  console.log("item.new_price", item.new_price)
  console.log("item.price", item.price)
  const regularPrice = item.new_price ? item.new_price : item.price;
  const totalQuantity = item.quantity;
  const regularTotal = regularPrice * totalQuantity;
  
  // Find promo for this product
  const promo = promos.find(p => p.product_id === item.id);
  
  if (!promo) {
    return {
      regularTotal,
      promoTotal: regularTotal,
      savings: 0,
      hasPromo: false,
      promoApplied: false
    };
  }
  
  const { qte: promoQty, price: promoPrice } = promo;
  
  // Calculate how many promo bundles we can apply
  const promoBundles = Math.floor(totalQuantity / promoQty);
  const remainingItems = totalQuantity % promoQty;
  
  // Promo price = (promo bundles * promo price) + (remaining items * regular price)
  const promoTotal = (promoBundles * promoPrice) + (remainingItems * regularPrice);
  const savings = regularTotal - promoTotal;
  
  return {
    regularTotal,
    promoTotal,
    savings,
    hasPromo: true,
    promoApplied: promoBundles > 0,
    promoBundles,
    remainingItems,
    promo
  };
};

console.log("foufou")



// Helper function to recalculate all totals
const recalculateTotals = (state) => {
  // Fix: Calculate totalQuantity based on unique items count
  state.totalQuantity = state.items.length;
  // Fix: Calculate totalItems as the sum of all quantities
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  
  let regularTotalAmount = 0;
  let promoTotalAmount = 0;
  
  // Optimize: Only recalculate pricing when necessary
  state.items.forEach(item => {
    const pricing = calculateItemPricing(item, state.promos);
    item.regularTotal = pricing.regularTotal;
    item.promoTotal = pricing.promoTotal;
    item.totalPrice = pricing.promoTotal; // Use promo price as final price
    item.savings = pricing.savings;
    item.hasPromo = pricing.hasPromo;
    item.promoApplied = pricing.promoApplied;
    
    regularTotalAmount += pricing.regularTotal;
    promoTotalAmount += pricing.promoTotal;
  });
  
  state.totalAmount = promoTotalAmount;
  state.regularTotalAmount = regularTotalAmount;
  state.totalSavings = regularTotalAmount - promoTotalAmount;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set promo rules from database
    setPromos: (state, action) => {
      state.promos = action.payload;
      // Recalculate prices with new promos
      recalculateTotals(state);
    },
    
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        // Add new item to cart
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          new_price: newItem.new_price || null,
          img: newItem.img,
          quantity: newItem.quantity || 1,
          totalPrice: 0, // Will be calculated in recalculateTotals
        });
      } else {
        // Update existing item quantity
        existingItem.quantity += newItem.quantity || 1;
        // Update new_price if it exists in the new item
        if (newItem.new_price) {
          existingItem.new_price = newItem.new_price;
        }
      }
      
      recalculateTotals(state);
    },
    
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        
        recalculateTotals(state);
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
        recalculateTotals(state);
      }
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      recalculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalItems = 0;
      state.totalAmount = 0;
      state.regularTotalAmount = 0;
      state.totalSavings = 0;
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  setPromos,
  addItem,
  removeItem,
  updateQuantity,
  removeFromCart,
  clearCart,
  toggleCart,
  openCart,
  closeCart
} = cartSlice.actions;

export default cartSlice.reducer;

