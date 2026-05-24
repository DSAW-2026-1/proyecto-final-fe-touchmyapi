import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Obtenemos los datos del localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Protección de ruta: Si no hay sesión, redirigir al login
  useEffect(() => {
    if (!isLoggedIn || !userData.email) {
      navigate('/login');
    }
  }, [isLoggedIn, userData, navigate]);

  // Si no está logueado, no renderizamos nada mientras ocurre la redirección
  if (!isLoggedIn || !userData.email) return null;

  // Extraemos el rol (asegúrate de que venga en el objeto userData)
  const userRole = userData.role || 'Comprador'; 

  return (
    <div className="min-h-screen bg-sabana-light p-6">
      {/* Botón de retorno al Home */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-sabana-blue font-bold mb-6 hover:text-sabana-blue-hover transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Marketplace
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-lg overflow-hidden">
        {/* Header del Perfil */}
        <div className="bg-sabana-blue p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black">
              {userData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-black">{userData.name || 'Usuario'}</h1>
              <p className="text-sabana-softGold font-medium mb-2">{userData.email}</p>
              
              {/* Insignia de Rol basada en la lógica de tu login */}
              <span className="bg-sabana-softGold text-sabana-blue px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-sabana-blue mb-6">Mi Cuenta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Inventario */}
            <div 
              onClick={() => navigate('/PersonalInventory')}
              className="border border-gray-100 p-6 rounded-3xl cursor-pointer hover:border-sabana-softGold transition-all group"
            >
              <Package className="text-sabana-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Mi Inventario</h3>
              <p className="text-sm text-gray-500">Gestiona tus productos publicados</p>
            </div>

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