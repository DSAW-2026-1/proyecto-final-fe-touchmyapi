import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Sacamos el usuario del localStorage (donde lo guardaste al hacer login)
  const user = JSON.parse(localStorage.getItem('user'));

  // Verificamos si existe y si su rol es ADMIN
  if (!user || user.role !== 'ADMIN') {
    alert("¡Error! No tienes permisos de administrador.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;