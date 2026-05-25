import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicialización síncrona leyendo el storage de inmediato
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Lo dejamos en false por defecto para que las rutas protegidas 
  // no crean que está cargando y te boten al login inmediatamente.
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData) => {
    const emailNormalizado = (userData?.email || '').toLowerCase().trim();
    
    // Si eres tú, papá, el rol es ADMIN sí o sí, sin importar qué mande el backend
    const isAdmin = emailNormalizado === 'jusselth@unisabana.edu.co' || userData?.role === 'ADMIN';
    const finalRole = isAdmin ? 'ADMIN' : (userData?.role || 'USER');

    // Mapeador exacto compatible con Checkout, Showcase y tu base de datos db.js
    const formattedUser = {
      email: emailNormalizado,
      name: userData?.name || userData?.name || (isAdmin ? 'Jusselth' : ''),
      lastName: userData?.lastName || (isAdmin ? 'Chica' : ''),
      career: userData?.career || '',
      role: finalRole,
      id: userData?.id ?? userData?.userId ?? userData?.user_id ?? (isAdmin ? 'ADMIN-001' : null)
    };

    // Guardamos en LocalStorage con llaves redundantes para que CUALQUIER componente lo lea bien
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(formattedUser));
    localStorage.setItem('userEmail', formattedUser.email);
    localStorage.setItem('userRole', formattedUser.role);
    if (formattedUser.id) localStorage.setItem('userId', String(formattedUser.id));

    setUser(formattedUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const updateUserRole = (newRole) => {
    localStorage.setItem('userRole', newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);