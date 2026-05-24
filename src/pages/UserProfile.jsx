import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft, Store, Clock, X, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Estados para controlar los modales
  const [showMgmtModal, setShowMgmtModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Estado para el historial de compras
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Protección de ruta: Si no hay sesión o usuario, redirigir al login
  useEffect(() => {
    if (!isLoggedIn || !user || !user.email) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Cargar el historial de órdenes cuando se abre el visor de historial
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

  if (!isLoggedIn || !user || !user.email) return null;

  // Evaluamos el estado del rol compuesto del estudiante
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
            
            
            <div 
              onClick={() => setShowMgmtModal(true)}
              className="border border-sabana-blue-light/40 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue transition-all group"
            >
              <ShoppingBag className="text-sabana-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Gestión de Productos</h3>
              <p className="text-sm text-gray-500">Administra tus ventas, inventario e historial de compras</p>
            </div>

            
            <div
              onClick={() => navigate('/password')} 
              className="border border-sabana-blue-light/40 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue transition-all group"
            >
              <Settings className="text-sabana-blue mb-4 group-hover:rotate-90 transition-transform" size={32} />
              <h3 className="font-bold text-sabana-blue">Configuración</h3>
              <p className="text-sm text-gray-500">Cambiar contraseña y seguridad</p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL PRINCIPAL DE GESTIÓN */}
      {showMgmtModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100">
            {/* Botón Cerrar */}
            <button 
              onClick={() => setShowMgmtModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-sabana-blue transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-black text-sabana-blue uppercase tracking-tight mb-2">
              Panel de Operaciones
            </h3>
            <p className="text-sm text-gray-400 font-medium mb-6">
              Selecciona la acción comercial que deseas realizar.
            </p>

            <div className="flex flex-col gap-4">
              
              {/*MI INVENTARIO O QUIERO SER VENDEDOR */}
              {isSellerOrAdmin ? (
                <div 
                  onClick={() => {
                    setShowMgmtModal(false);
                    navigate('/PersonalInventory');
                  }}
                  className="flex items-center gap-4 border border-gray-100 p-4 rounded-2xl cursor-pointer hover:border-sabana-blue hover:bg-gray-50/50 transition-all group"
                >
                  <div className="bg-sabana-blue/10 p-3 rounded-xl text-sabana-blue group-hover:animate-bounce group-hover:scale-105 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sabana-blue text-sm">Mi Inventario de Venta</h4>
                    <p className="text-xs text-gray-500">Añade, edita o elimina tus publicaciones del campus</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setShowMgmtModal(false);
                    navigate('/PersonalInventory');
                  }}
                  className="flex items-center gap-4 border-2 border-dashed border-gray-200 p-4 rounded-2xl cursor-pointer hover:border-sabana-softGold bg-amber-50/20 hover:bg-white transition-all group"
                >
                  <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500 group-hover:animate-bounce">
                    <Store size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sabana-blue text-sm">¡Quiero ser vendedor!</h4>
                    <p className="text-xs text-gray-400">Publica tu primer artículo para activar tu rol comercial</p>
                  </div>
                </div>
              )}

              {/* HISTORIAL DE COMPRAS */}
              <div 
                onClick={() => {
                  setShowMgmtModal(false);
                  setShowHistoryModal(true);
                  fetchPurchaseHistory();
                }}
                className="flex items-center gap-4 border border-gray-100 p-4 rounded-2xl cursor-pointer hover:border-sabana-blue hover:bg-gray-50/50 transition-all group"
              >
                <div className="bg-sabana-blue/10 p-3 rounded-xl text-sabana-blue group-hover:rotate-12 group-hover:animate-spin-slow">
                  <Clock size={24} /> 
                </div>
                <div>
                  <h4 className="font-bold text-sabana-blue text-sm">Historial de Compras</h4>
                  <p className="text-xs text-gray-500">Revisa los recibos y detalles de tus adquisiciones</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL VISOR DEL HISTORIAL DE COMPRAS */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[85vh]">
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-sabana-blue transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-black text-sabana-blue uppercase tracking-tight flex items-center gap-2">
                <Clock className="text-sabana-blue-light" size={24} /> Mis Compras Realizadas
              </h3>
              <p className="text-xs text-gray-400 font-medium">Lista de órdenes despachadas asociadas a tu cuenta institucional.</p>
            </div>

            {/* Contenedor con Scroll para las órdenes */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-2">
              {loadingOrders ? (
                <p className="text-center text-sm text-gray-500 py-8 font-medium">Buscando tus recibos en el sistema...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/40">
                  <Clock className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-sm font-bold text-sabana-blue">Aún no registras compras</p>
                  <p className="text-xs text-gray-400 mt-1">Los artículos que adquieras en la vitrina se listarán aquí.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                      <div>
                        <span className="text-xs font-black text-sabana-blue uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                          Orden #{order.id}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">Destino: Universidad de la Sabana</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Pagado</p>
                        <p className="text-base font-black text-sabana-blue">${order.totalAmount?.toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                    
                    {/* Items comprados en esa orden */}
                    <div className="space-y-1.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-medium text-gray-600 bg-white p-2 rounded-xl border border-gray-50">
                          <span>
                            {item.title || `Artículo ID: ${item.productId}`}{' '}
                            <span className="text-gray-400 font-bold">(x{item.quantity})</span>
                          </span>
                          
                          <span className="font-bold text-gray-700">
                            ${(Number(item.price || 0) * Number(item.quantity)).toLocaleString('es-CO')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="w-full bg-sabana-blue text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-sabana-blue-hover transition-colors mt-2"
            >
              Cerrar Historial
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;