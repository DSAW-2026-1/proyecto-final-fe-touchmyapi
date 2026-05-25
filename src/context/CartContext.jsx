import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { addLocalNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Función para agregar al carrito (CON VALIDACIÓN DE STOCK)
  const addToCart = (product, quantityToAdd = 1) => {
    // Primero hacemos la validación de stock mirando lo que ya hay en el carrito
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantityToAdd;

    if (newQuantity > product.stock) {
      alert(`¡Ups! Solo hay ${product.stock} unidades disponibles de este producto.`);
      return;
    }

    // Actualizamos el estado del carrito de forma limpia
    setCartItems((prevItems) => {
      const itemEnCarrito = prevItems.find((item) => item.id === product.id);
      if (itemEnCarrito) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: itemEnCarrito.quantity + quantityToAdd } : item
        );
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });

    // ¡EL CAMBIO CLAVE!: Ejecutamos la notificación AFUERA del estado, 
    // justo después de mandar a actualizar el carrito de forma segura.
    addLocalNotification(
      `Añadiste ${quantityToAdd} unidad(es) de "${product.title}" a tu carrito de compras.`, 
      'CARRITO'
    );
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