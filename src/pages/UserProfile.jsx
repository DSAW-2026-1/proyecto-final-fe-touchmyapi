import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Settings, LogOut, ArrowLeft } from 'lucide-react';


const UserProfile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-sabana-light p-6">
      {/* Botón de retorno */}
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
              <p className="text-sabana-softGold font-medium">{userData.email}</p>
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
            className="border border-gray-100 p-6 rounded-3xl cursor-pointer hover:border-sabana-softGold transition-all group">
              <Settings className="text-sabana-blue mb-4 group-hover:rotate-90 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Configuración</h3>
              <p className="text-sm text-gray-500">Actualiza tus datos personales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;