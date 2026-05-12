import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Calcula cuántos artículos físicos hay en total en el carrito
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // NUEVA FUNCIÓN: Suma el valor (precio * cantidad) de cada producto en el carrito
  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  // Función para eliminar del carrito por si CartPage la necesita
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      getCartCount, 
      getCartTotalPrice, // <-- Asegúrate de pasarla aquí para que CartPage pueda consumirla
      removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};