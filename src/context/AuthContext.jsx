import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si hay sesión guardada
    const savedUser = localStorage.getItem('user');
    const savedStatus = localStorage.getItem('isLoggedIn') === 'true';
    
    if (savedUser && savedStatus) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userId = userData?.id ?? userData?.userId ?? userData?.user_id;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    if (userId != null) localStorage.setItem('userId', String(userId));
    if (userData?.email) localStorage.setItem('userEmail', userData.email);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear(); // Limpia todo
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/'; // Opcional: redirigir al home
  };

  const updateUserRole = (newRole) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updated = { ...prevUser, role: newRole };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);