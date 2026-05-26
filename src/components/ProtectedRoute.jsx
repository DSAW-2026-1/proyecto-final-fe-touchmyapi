import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();

  // 1. Si el contexto dice que está cargando, esperamos
  if (loading) {
    return null; 
  }

  // 2. RESPALDO SÍNCRONO: Si el estado de React aún no ha cargado, 
  // leemos directamente el LocalStorage para evitar rebotes falsos.
  const localIsLoggedIn = isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  const localUserRaw = localStorage.getItem('user');
  const localUser = localUserRaw ? JSON.parse(localUserRaw) : null;
  
  // Evaluamos el rol combinando el estado de React y el LocalStorage
  const userRole = user?.role || localUser?.role || localStorage.getItem('userRole');
  const userEmail = user?.email || localUser?.email || localStorage.getItem('userEmail') || '';

  // Si el correo es el tuyo de administrador, le damos paso libre sí o sí
  const isAdmin = userRole === 'ADMIN' || userEmail.toLowerCase().trim() === 'jusselth@unisabana.edu.co';

  // 3. Validación final libre de parpadeos
  if (!localIsLoggedIn || !isAdmin) {
    alert("No tienes permisos de administrador para entrar aquí.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;