import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  
  const { user, isLoggedIn, loading } = useAuth();

  
  if (loading) {
    return null; 
  }


  if (!isLoggedIn || user?.role !== 'ADMIN') {
    
    alert("No tienes permisos de administrador para entrar aquí.");
    return <Navigate to="/login" replace />;
  }

  
  return children;
};

export default ProtectedRoute;