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
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear(); // Limpia todo
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/'; // Opcional: redirigir al home
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);