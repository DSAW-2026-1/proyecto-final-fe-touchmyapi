import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft, Store, Clock, X, ShoppingBag, Star, Hand, CheckCircle2 } from 'lucide-react';
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

  // Estado para evitar clicks duplicados y manejar la carga de actualización de estado
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Estados para el formulario de reseña activa (Mantenido de HEAD)
  const [activeReviewProd, setActiveReviewProd] = useState(null); // Guarda { orderId, productId, sellerEmail }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Protección de ruta estricta (Combinación segura de ambas ramas)
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
        // Ordenar de manera descendente (la más reciente primero)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setOrders(sortedData);
      }
    } catch (error) {
      console.error("Error al traer el historial de compras:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Nueva función para el flujo coordinado: Comprador solicita encuentro presencial en campus
  const handleQuieroMiProducto = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'QUIERO_MI_PRODUCTO' })
      });

      if (response.ok) {
        // Actualizar el estado localmente de inmediato para reflejar la animación del badge
        setOrders(prevOrders => 
          prevOrders.map(o => o.id === orderId ? { ...o, status: 'QUIERO_MI_PRODUCTO' } : o)
        );
      } else {
        alert("No se pudo procesar la solicitud del producto.");
      }
    } catch (error) {
      console.error("Error al actualizar estado de la orden:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Lógica para enviar la reseña al Backend (Mantenido de HEAD)
  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Por favor escribe un comentario para tu reseña.");
    
    setSubmittingReview(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activeReviewProd.productId,
          rating,
          comment: comment.trim(),
          buyerEmail: user.email,
          sellerEmail: activeReviewProd.sellerEmail
        })
      });

      if (response.ok) {
        alert("¡Tu reseña ha sido guardada con éxito!");
        
        // Guardar persistencia local para marcar este artículo específico como calificado
        localStorage.setItem(`reviewed_${activeReviewProd.orderId}_${activeReviewProd.productId}`, 'true');

        setActiveReviewProd(null);
        setComment("");
        setRating(5);
      } else {
        alert("No se pudo enviar la calificación.");
      }
    } catch (error) {
      console.error("Error al enviar reseña:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isLoggedIn || !user || !user.email) return null;

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
                  <p className="text-xs text-gray-500">Revisa tus recibos y califica tus productos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL COMPLETO DEL HISTORIAL DE COMPRAS Y CALIFICACIONES */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[85vh]">
            <button 
              onClick={() => {
                setShowHistoryModal(false);
                setActiveReviewProd(null);
              }}
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
                <p className="text-center text-sm text-gray-500 py-8 font-medium">Buscando tus recibos del campus...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/40">
                  <Clock className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-sm font-bold text-sabana-blue">Aún no registras compras</p>
                  <p className="text-xs text-gray-400 mt-1">Los artículos que adquieras en la vitrina se listarán aquí.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-2 mb-2 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-sabana-blue uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                          Orden #{order.id}
                        </span>
                        
                        {/* Renderizado de Badges con lógica e identidades del flujo de 3 pasos */}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          order.status === 'ENTREGADO' || order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-700' 
                            : order.status === 'QUIERO_MI_PRODUCTO'
                            ? 'bg-purple-100 text-purple-700 animate-pulse'
                            : order.status === 'LISTO' || order.status === 'READY_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status === 'READY_FOR_DELIVERY' ? 'LISTO' : order.status === 'DELIVERED' ? 'ENTREGADO' : (order.status || 'PENDIENTE')}
                        </span>
                        
                        {/* Botón interactivo para coordinar entrega en campus cuando pasa a LISTO o READY_FOR_DELIVERY */}
                        {(order.status === 'LISTO' || order.status === 'READY_FOR_DELIVERY') && (
                          <button
                            onClick={() => handleQuieroMiProducto(order.id)}
                            disabled={updatingOrderId === order.id}
                            className="flex items-center gap-1 bg-sabana-blue text-white text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider hover:bg-sabana-blue-hover transition-all disabled:opacity-50 shadow-xs animate-bounce"
                          >
                            <Hand size={10} /> ¡Quiero mi producto!
                          </button>
                        )}
                        
                        <p className="w-full text-[10px] text-gray-400 font-medium mt-0.5">Destino: Universidad de la Sabana</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                        <p className="text-base font-black text-sabana-blue">${order.totalAmount?.toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                    
                    {/* Items comprados en esa orden */}
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => {
                        const isSelectedForReview = activeReviewProd?.orderId === order.id && activeReviewProd?.productId === item.productId;
                        
                        // Validar si este item particular ya fue calificado en el localStorage
                        const isReviewed = localStorage.getItem(`reviewed_${order.id}_${item.productId}`) === 'true';

                        return (
                          <div key={idx} className="flex flex-col bg-white p-3 rounded-xl border border-gray-50 space-y-2">
                            <div className="flex justify-between items-center text-xs font-medium text-gray-600 gap-2">
                              <span className="truncate">
                                {item.title || `Artículo ID: ${item.productId}`}{' '}
                                <span className="text-gray-400 font-bold shrink-0">({item.price} x {item.quantity})</span>
                              </span>
                              
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-bold text-gray-700">
                                  ${(Number(item.price || 0) * Number(item.quantity)).toLocaleString('es-CO')}
                                </span>
                                
                                {/* Sección de Calificaciones controlada por el estado de la Orden (ENTREGADO/DELIVERED) y LocalStorage */}
                                {(order.status === 'ENTREGADO' || order.status === 'DELIVERED') && (
                                  <div className="min-w-[70px] text-right">
                                    {isReviewed ? (
                                      <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1 justify-end">
                                        <CheckCircle2 size={12} /> Calificado
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => setActiveReviewProd(isSelectedForReview ? null : {
                                          orderId: order.id,
                                          productId: item.productId,
                                          sellerEmail: item.ownerEmail
                                        })}
                                        className="px-3 py-1 bg-sabana-light text-sabana-blue border border-sabana-blue/20 rounded-lg text-[10px] font-black uppercase hover:bg-sabana-blue hover:text-white transition-all shadow-xs"
                                      >
                                        {isSelectedForReview ? 'Cancelar' : 'Calificar'}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Despliegue del Formulario de Calificación */}
                            {isSelectedForReview && !isReviewed && (
                              <form onSubmit={handleSendReview} className="border-t border-gray-100 pt-3 mt-2 animate-fadeIn space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-gray-400 uppercase">Calificación:</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={18}
                                        className={`cursor-pointer transition-colors ${
                                          star <= rating ? 'text-amber-500 fill-amber-400' : 'text-gray-200'
                                        }`}
                                        onClick={() => setRating(star)}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Cuéntanos qué tal la entrega y el estado de tu artículo en el campus..."
                                    rows="2"
                                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-slate-50/50 focus:outline-none focus:border-sabana-blue transition-colors"
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="bg-sabana-blue text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-sabana-blue-hover transition-all disabled:opacity-50 shadow-xs"
                                  >
                                    {submittingReview ? 'Guardando...' : 'Enviar Reseña'}
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => {
                setShowHistoryModal(false);
                setActiveReviewProd(null);
              }}
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