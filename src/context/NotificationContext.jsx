import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // Persistencia: Guardar siempre que cambie el estado
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Conexión Sockets
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const socketClient = io(apiUrl);
      setSocket(socketClient);
      socketClient.emit('register_user', user.email);
      socketClient.on('notification_received', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
      });
      return () => socketClient.disconnect();
    }
  }, [isLoggedIn, user?.email]);

  // 3. Función unificada corregida
  const fetchAllNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/notifications/user/${user.email}`);
      if (!res.ok) return;
      
      const data = await res.json();
      // Si data es un objeto con .notifications, usamos eso; si es array, usamos data
      const serverNotifs = data.notifications || (Array.isArray(data) ? data : []);

      setNotifications((prev) => {
        const localCartNotifs = prev.filter(n => n.type === 'CARRITO');
        const welcomeNotif = prev.find(n => n.type === 'BIENVENID@');
        
        // Unimos: Servidor + Carrito Local + Bienvenida (si existía)
        const combined = [...serverNotifs, ...localCartNotifs];
        if (welcomeNotif) combined.push(welcomeNotif);
        
        // Filtramos duplicados por ID y ordenamos
        const unique = Array.from(new Map(combined.map(n => [n.id, n])).values());
        return unique.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  };

  // Efecto Bienvenida corregido
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchAllNotifications();
      
      // Solo inyectar si no existe en el estado actual
      setNotifications(prev => {
        if (prev.some(n => n.type === 'BIENVENID@')) return prev;
        const welcomeNotif = {
          id: `welcome-${user.email}`,
          userEmail: user.email,
          text: `¡Hola! Qué alegría tenerte en nuestra plataforma.`,
          type: 'BIENVENID@',
          read: false,
          date: new Date().toISOString()
        };
        return [welcomeNotif, ...prev];
      });
    }
  }, [isLoggedIn, user?.email]);

  const markAllAsRead = async () => {
    if (!user?.email) return;
    try {
      await fetch(`${apiUrl}/api/v1/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const addLocalNotification = (text, type = 'CARRITO') => {
    const localNotif = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userEmail: user?.email || '',
      text,
      type,
      read: false,
      date: new Date().toISOString()
    };
    setNotifications(prev => [localNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchAllNotifications, markAllAsRead, addLocalNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => useContext(NotificationContext);