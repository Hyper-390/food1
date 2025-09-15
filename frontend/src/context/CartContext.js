import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Initial state
const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  restaurant: JSON.parse(localStorage.getItem('cartRestaurant')) || null,
  total: 0
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_RESTAURANT = 'SET_RESTAURANT';

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case SET_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload
      };
    
    case ADD_TO_CART: {
      const { menuItem, quantity = 1, specialInstructions = '' } = action.payload;
      const existingItem = state.items.find(item => 
        item.menuItem._id === menuItem._id && 
        item.specialInstructions === specialInstructions
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.menuItem._id === menuItem._id && item.specialInstructions === specialInstructions
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          menuItem,
          quantity,
          specialInstructions,
          price: menuItem.price
        }];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total
      };
    }

    case REMOVE_FROM_CART: {
      const newItems = state.items.filter((_, index) => index !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total,
        restaurant: newItems.length === 0 ? null : state.restaurant
      };
    }

    case UPDATE_QUANTITY: {
      const { index, quantity } = action.payload;
      let newItems;
      
      if (quantity <= 0) {
        newItems = state.items.filter((_, i) => i !== index);
      } else {
        newItems = state.items.map((item, i) =>
          i === index ? { ...item, quantity } : item
        );
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total,
        restaurant: newItems.length === 0 ? null : state.restaurant
      };
    }

    case CLEAR_CART:
      return {
        items: [],
        restaurant: null,
        total: 0
      };

    default:
      return state;
  }
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
    localStorage.setItem('cartRestaurant', JSON.stringify(state.restaurant));
  }, [state.items, state.restaurant]);

  // Calculate total when items change
  useEffect(() => {
    const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (state.total !== total) {
      // Only update if total changed to avoid infinite loops
      const newState = { ...state, total };
      localStorage.setItem('cartItems', JSON.stringify(newState.items));
    }
  }, [state.items]);

  const addToCart = (menuItem, quantity = 1, specialInstructions = '') => {
    // If adding from a different restaurant, confirm with user
    if (state.restaurant && state.restaurant._id !== menuItem.restaurant._id) {
      const confirmChange = window.confirm(
        'Adding items from a different restaurant will clear your current cart. Continue?'
      );
      
      if (confirmChange) {
        dispatch({ type: CLEAR_CART });
        dispatch({ type: SET_RESTAURANT, payload: menuItem.restaurant });
      } else {
        return;
      }
    } else if (!state.restaurant) {
      dispatch({ type: SET_RESTAURANT, payload: menuItem.restaurant });
    }

    dispatch({
      type: ADD_TO_CART,
      payload: { menuItem, quantity, specialInstructions }
    });
  };

  const removeFromCart = (index) => {
    dispatch({ type: REMOVE_FROM_CART, payload: index });
  };

  const updateQuantity = (index, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { index, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    restaurant: state.restaurant,
    total: state.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;