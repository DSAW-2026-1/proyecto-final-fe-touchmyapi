// src/services/chatService.js
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/chats`;

export const chatService = {
  // Crea el chat y retorna el objeto del chat creado
  createChat: async (productId, buyerEmail, sellerEmail, productTitle, firstMessage) => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, buyerEmail, sellerEmail, productTitle, firstMessage }),
    });
    if (!response.ok) throw new Error('Error al crear chat');
    return response.json();
  },

  // Obtiene todos los chats de un usuario (para la bandeja de entrada del Comprador)
  getUserChats: async (email) => {
    const response = await fetch(`${API_URL}/user/${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Error al obtener chats');
    return response.json();
  },

  // Obtiene los chats agrupados por producto (para el Vendedor)
  getSellerChats: async (sellerEmail) => {
    const response = await fetch(`${API_URL}/seller/grouped/${encodeURIComponent(sellerEmail)}`);
    if (!response.ok) throw new Error('Error al obtener chats de vendedor');
    return response.json();
  },

  // Enviar mensaje
  sendMessage: async (chatId, sender, text) => {
    const response = await fetch(`${API_URL}/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, text }),
    });
    if (!response.ok) throw new Error('Error al enviar mensaje');
    return response.json();
  }
};