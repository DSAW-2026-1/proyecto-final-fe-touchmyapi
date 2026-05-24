import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); // Usamos el contexto global directamente

  // Protección de ruta: Si no hay sesión o usuario, redirigir al login
  useEffect(() => {
    if (!isLoggedIn || !user || !user.email) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Si no está logueado, no renderizamos nada mientras ocurre la redirección
  if (!isLoggedIn || !user || !user.email) return null;

  // Evaluamos el estado del rol del estudiante usando el contexto mutado
  const isSellerOrAdmin = user.role === 'SELLER' || user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-sabana-light p-6">
      {/* Botón de retorno al Home */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-sabana-blue font-bold mb-6 hover:text-sabana-blue-hover transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Marketplace
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Banner Superior */}
        <div className="bg-sabana-blue p-8 text-default-white relative">
          <div className="flex flex-col md:flex-row gap-6 items-center z-10 relative">
            <div className="w-24 h-24 rounded-full bg-sabana-softGold/20 border-2 border-sabana-softGold flex items-center justify-center font-black text-3xl text-sabana-softGold uppercase">
              {user.name?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tight uppercase">
                {user.name} {user.lastName}
              </h1>
              <p className="text-sabana-softGold font-medium text-sm tracking-wide">{user.career}</p>
              <div className="mt-2 inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-white/90">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-sabana-blue mb-6">Mi Cuenta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 🌟 RENDERIZADO CONDICIONAL SEGÚN ROL COMPUESTO */}
            {isSellerOrAdmin ? (
              /* Muestra el Inventario si ya es Vendedor o Administrador */
              <div 
                onClick={() => navigate('/PersonalInventory')}
                className="border border-gray-100 p-6 rounded-3xl cursor-pointer hover:border-sabana-softGold transition-all group"
              >
                <Package className="text-sabana-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold text-sabana-blue">Mi Inventario</h3>
                <p className="text-sm text-gray-500">Gestiona tus productos publicados</p>
              </div>
            ) : (
              /* Mensaje e invitación interactiva si es únicamente Comprador (USER) */
              <div 
                onClick={() => navigate('/PersonalInventory')}
                className="border-2 border-dashed border-gray-200 p-6 rounded-3xl cursor-pointer hover:border-sabana-softGold bg-gray-50/50 hover:bg-white transition-all group"
              >
                <Store className="text-amber-500 mb-4 group-hover:animate-bounce transition-transform" size={32} />
                <h3 className="font-bold text-sabana-blue group-hover:text-sabana-softGold transition-colors">¡Quiero ser vendedor!</h3>
                <p className="text-sm text-gray-400 font-medium">Publica tu primer artículo en el campus y activa tu perfil comercial.</p>
              </div>
            )}

            {/* Tarjeta de Ajustes */}
            <div
              onClick={() => navigate('/password')} 
              className="border border-gray-100 p-6 rounded-3xl cursor-pointer hover:border-sabana-softGold transition-all group"
            >
              <Settings className="text-sabana-blue mb-4 group-hover:rotate-90 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Configuración</h3>
              <p className="text-sm text-gray-500">Cambiar contraseña y seguridad</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;