import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. Función para agregar al carrito (CON VALIDACIÓN DE STOCK)
  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + quantityToAdd;

      // VALIDACIÓN: ¿La nueva cantidad supera el stock disponible?
      // Nota: Asegúrate de que el objeto 'product' que traes del backend incluya la propiedad 'stock'
      if (newQuantity > product.stock) {
        alert(`¡Ups! Solo hay ${product.stock} unidades disponibles de este producto.`);
        return prevItems; // Retorna la lista como estaba, cancelando la adición
      }

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });
  };

  // 2. NUEVA FUNCIÓN: Para actualizar la cantidad directamente en la página del carrito (+ / -)
  const updateQuantity = (productId, newQuantity, maxStock) => {
    if (newQuantity > maxStock) {
      alert(`No puedes agregar más. El stock máximo de este producto es ${maxStock}.`);
      return;
    }
    
    // Si la cantidad llega a 0, mejor lo eliminamos del carrito
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 3. Calcula cuántos artículos físicos hay en total en el carrito
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // 4. Suma el valor (precio * cantidad) de cada producto en el carrito
  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  // 5. Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  // 6. NUEVA FUNCIÓN: Vacía el carrito (Úsala cuando el pago sea exitoso en CheckoutPage)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity,
      getCartCount, 
      getCartTotalPrice, 
      removeFromCart,
      clearCart
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