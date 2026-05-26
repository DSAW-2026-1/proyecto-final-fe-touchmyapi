import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, Package, ShoppingCart, User, Key, Star, MessageSquare } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import logoSabana from '../assets/sabanalogo.png';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { notifications, fetchAllNotifications, markAllAsRead, markAsRead } = useNotifications();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // 1. Cargamos primero los datos
    const loadData = async () => {
      await fetchAllNotifications();
      // 2. Solo después de cargar, marcamos como leídas
      markAllAsRead();
    };

    loadData();
  }, [isLoggedIn, navigate]);

  // Selector estético de iconos según el tipo de notificación del backend
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BIENVENIDA': return <User className="text-blue-500" size={18} />;
      case 'COMPRA': return <ShoppingCart className="text-emerald-500" size={18} />;
      case 'VENTA': return <CheckCircle className="text-amber-500" size={18} />;
      case 'CARRITO': return <ShoppingCart className="text-indigo-400" size={18} />;
      case 'PASSWORD': return <Key className="text-rose-500" size={18} />;
      case 'ENTREGA': return <Package className="text-orange-500" size={18} />;
      case 'RESEÑA': return <Star className="text-yellow-500" fill="currentColor" size={18} />;
      default: return <Bell className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-roboto">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')} 
            className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-600 hover:text-sabana-blue transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Campus
          </button>
          <img src={logoSabana} alt="Logo Sabana" className="h-9 object-contain" />
        </div>
      </header>

      {/* Cuerpo Principal */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-roboto-slab font-black text-sabana-blue uppercase tracking-wide flex items-center gap-2">
            <Bell size={24} className="text-sabana-blue" /> Centro de Notificaciones
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Seguimiento en vivo de tus compras, ventas y seguridad en la plataforma.</p>
        </div>

        {/* Listado de Alertas */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <Bell className="mx-auto text-slate-200" size={48} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tu buzón está al día</p>
              <p className="text-xs text-gray-400">No registras alertas ni novedades pendientes por revisar actualmente.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 bg-white rounded-2xl border transition-all flex gap-4 items-start shadow-xs ${
                  !notif.read ? 'border-l-4 border-l-sabana-blue bg-blue-50/10' : 'border-slate-100'
                }`}
              >
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-black tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                      {notif.type || 'SISTEMA'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {new Date(notif.date).toLocaleDateString('es-CO')} - {new Date(notif.date).toLocaleTimeString('es-CO', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{notif.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;