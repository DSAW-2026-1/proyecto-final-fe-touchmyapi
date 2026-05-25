import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft, Store, Clock, X, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isLoggedIn: authIsLoggedIn } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Recuperar usuario de manera más robusta si el contexto falla al inicio
  const user = useMemo(() => {
    if (authUser) return authUser;
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }, [authUser]);

  const isLoggedIn = authIsLoggedIn || !!localStorage.getItem('isLoggedIn');

  // Estados para controlar los modales
  const [showMgmtModal, setShowMgmtModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Estado para el historial de compras
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Protección de ruta
  useEffect(() => {
    if (!isLoggedIn || !user || !user.email) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  const fetchPurchaseHistory = async () => {
    if (!user?.email) return;
    setLoadingOrders(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/user/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error al traer el historial de compras:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isLoggedIn || !user) return null;

  const isSellerOrAdmin = user.role === 'SELLER' || user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-sabana-light p-6">
      {/* Botón de retorno al Home */}
      <div className="flex justify-end w-full max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/home')} 
          className="flex items-center gap-2 text-sabana-blue font-bold mb-6 hover:text-sabana-blue-hover transition-colors"
        >
          <ArrowLeft size={20} /> Volver al Marketplace
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Banner Superior */}
        <div className="bg-sabana-blue p-8 text-white relative">
          <div className="flex flex-col md:flex-row gap-6 items-center z-10 relative">
            <div className="w-24 h-24 rounded-full bg-sabana-softGold/20 border-2 border-sabana-softGold flex items-center justify-center font-black text-3xl text-sabana-softGold uppercase">
              {user.name?.[0]}{user.lastName?.[0]}
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
            <div onClick={() => setShowMgmtModal(true)} className="border border-sabana-blue-light/40 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue transition-all group">
              <ShoppingBag className="text-sabana-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Gestión de Productos</h3>
              <p className="text-sm text-gray-500">Administra tus ventas, inventario e historial de compras</p>
            </div>
            <div onClick={() => navigate('/password')} className="border border-sabana-blue-light/40 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue transition-all group">
              <Settings className="text-sabana-blue mb-4 group-hover:rotate-90 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Configuración</h3>
              <p className="text-sm text-gray-500">Cambiar contraseña y seguridad</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PRINCIPAL DE GESTIÓN */}
      {showMgmtModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setShowMgmtModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-sabana-blue transition-colors"><X size={24} /></button>
            <h3 className="text-xl font-black text-sabana-blue uppercase tracking-tight mb-6">Panel de Operaciones</h3>
            <div className="flex flex-col gap-4">
              <div onClick={() => { setShowMgmtModal(false); navigate('/PersonalInventory'); }} className="flex items-center gap-4 border p-4 rounded-2xl cursor-pointer hover:border-sabana-blue transition-all">
                <div className="bg-sabana-blue/10 p-3 rounded-xl text-sabana-blue"><Package size={24} /></div>
                <div>
                  <h4 className="font-bold text-sabana-blue text-sm">{isSellerOrAdmin ? 'Mi Inventario' : '¡Quiero ser vendedor!'}</h4>
                  <p className="text-xs text-gray-500">Gestiona tus productos o activa tu rol</p>
                </div>
              </div>
              <div onClick={() => { setShowMgmtModal(false); setShowHistoryModal(true); fetchPurchaseHistory(); }} className="flex items-center gap-4 border p-4 rounded-2xl cursor-pointer hover:border-sabana-blue transition-all">
                <div className="bg-sabana-blue/10 p-3 rounded-xl text-sabana-blue"><Clock size={24} /></div>
                <div>
                  <h4 className="font-bold text-sabana-blue text-sm">Historial de Compras</h4>
                  <p className="text-xs text-gray-500">Revisa tus recibos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* (Mantén el resto de tu lógica del Modal de Historial exactamente igual) */}
    </div>
  );
};

export default UserProfile;