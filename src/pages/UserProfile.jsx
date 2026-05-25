import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, ArrowLeft, Store, Clock, X, ShoppingBag, Star } from 'lucide-react';
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

  // Estados para el formulario de reseña activa (Mantenido de tu lógica original)
  const [activeReviewProd, setActiveReviewProd] = useState(null); // Guarda { orderId, productId, sellerEmail }
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

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
      console.error("Error al cargar historial de compras:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // CONFIRMACIÓN DE ENTREGA POR PARTE DEL COMPRADOR (SINCRONIZADO CON EL PATCH DEL BACKEND)
  const handleConfirmDelivery = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
        method: 'PATCH', // Cambiado a PATCH para que coincida exactamente con orderRoutes.js
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' })
      });

      if (response.ok) {
        // Actualizamos localmente el estado de la orden para mutar la interfaz inmediatamente
        setOrders(prevOrders => 
          prevOrders.map(order => order.id === orderId ? { ...order, status: 'DELIVERED' } : order)
        );
        alert("¡Entrega confirmada! Ahora puedes calificar el servicio del vendedor.");
      } else {
        alert("No se pudo confirmar la recepción del producto.");
      }
    } catch (error) {
      console.error("Error al confirmar entrega:", error);
      alert("Error de conexión al procesar la entrega.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeReviewProd) return;
    if (rating === 0) {
      alert("Por favor selecciona una calificación en estrellas.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeReviewProd.orderId,
          productId: activeReviewProd.productId,
          buyerEmail: user.email,
          sellerEmail: activeReviewProd.sellerEmail,
          rating: rating,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        alert("¡Muchas gracias! Tu reseña ha sido guardada exitosamente.");
        setActiveReviewProd(null);
        setRating(0);
        setComment("");
        // Refrescar historial para reflejar los cambios
        fetchPurchaseHistory();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || "No se pudo procesar tu calificación en este momento.");
      }
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      alert("Error crítico de red al intentar enviar tu reseña.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isLoggedIn || !user) return null;

  const isSellerOrAdmin = user.role === 'SELLER' || user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-sabana-light p-6 font-roboto">
      {/* BOTÓN SUPERIOR VOLVER */}
      <div className="flex justify-end w-full max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/publicshowcase')} 
          className="flex items-center gap-2 text-sabana-blue font-bold mb-6 hover:text-sabana-blue-hover transition-colors text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Volver al Marketplace
        </button>
      </div>

      {/* TARJETA DE PERFIL CENTRAL */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sabana-card overflow-hidden border border-gray-100">
        <div className="bg-sabana-blue p-8 text-white relative">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-sabana-softGold/20 border-2 border-sabana-softGold flex items-center justify-center font-black text-3xl text-sabana-softGold uppercase shadow-inner">
              {user.name?.[0] || 'U'}{user.lastName?.[0] || 'S'}
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl font-roboto-slab font-black tracking-tight uppercase">
                {user.name} {user.lastName}
              </h1>
              <p className="text-sabana-softGold font-bold text-xs tracking-wide uppercase">{user.career || 'Estudiante Sabana'}</p>
              <div className="pt-1">
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                  Rol: {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE OPERACIONES */}
        <div className="p-8">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Mi Cuenta Universitaria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div 
              onClick={() => setShowMgmtModal(true)} 
              className="border border-gray-200/80 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue hover:shadow-md transition-all group bg-slate-50/30 flex flex-col items-center text-center"
            >
              <ShoppingBag className="text-sabana-blue mb-3 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Gestión del Campus</h3>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">Inventarios, ventas y estados de despachos.</p>
            </div>

            <div 
              onClick={() => { setShowHistoryModal(true); fetchPurchaseHistory(); }} 
              className="border border-gray-200/80 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue hover:shadow-md transition-all group bg-slate-50/30 flex flex-col items-center text-center"
            >
              <Clock className="text-sabana-blue mb-3 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Historial de Compras</h3>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">Revisa tus compras hechas y califica el servicio.</p>
            </div>

            <div 
              onClick={() => navigate('/password')} 
              className="border border-gray-200/80 p-6 rounded-3xl cursor-pointer hover:border-sabana-blue hover:shadow-md transition-all group bg-slate-50/30 flex flex-col items-center text-center"
            >
              <Settings className="text-sabana-blue mb-3 group-hover:rotate-45 transition-transform" size={28} />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Seguridad</h3>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">Actualiza tu contraseña y preferencias.</p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL 1: PANEL DE OPERACIONES GESTIÓN */}
      {showMgmtModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border animate-fadeIn">
            <button 
              onClick={() => setShowMgmtModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-roboto-slab font-black text-sabana-blue mb-6 uppercase tracking-wider">Panel Operativo</h3>
            <div className="flex flex-col gap-4">
              
              <div 
                onClick={() => { setShowMgmtModal(false); navigate('/PersonalInventory'); }} 
                className="flex items-center gap-4 border border-gray-100 p-4 rounded-2xl cursor-pointer hover:border-sabana-blue hover:bg-slate-50 transition-all"
              >
                <Store size={22} className="text-sabana-blue shrink-0" />
                <div>
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">
                    {isSellerOrAdmin ? 'Mi Inventario y Ventas' : 'Quiero ser Vendedor'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Publica productos y visualiza solicitudes de la comunidad.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HISTORIAL DE COMPRAS INTEGRADO CON FLUJO DE ENTREGA */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[85vh] animate-fadeIn">
            <button 
              onClick={() => { setShowHistoryModal(false); setActiveReviewProd(null); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="border-b pb-3 mb-4 shrink-0">
              <h3 className="text-sm font-roboto-slab font-black text-sabana-blue uppercase tracking-wider">Mis Pedidos Realizados</h3>
              <p className="text-[11px] text-gray-400 font-bold mt-0.5 uppercase">Visualiza las respuestas de tus vendedores y confirma recepciones.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {loadingOrders ? (
                <p className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest">Cargando tus compras...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed space-y-2">
                  <ShoppingBag className="mx-auto text-gray-300" size={32} />
                  <p className="text-xs font-bold text-slate-600">Aún no has comprado ningún producto en el marketplace.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 bg-slate-50/40 p-4 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b pb-2">
                      <div>
                        <span className="text-[9px] font-black bg-slate-200 text-slate-700 px-2 py-0.5 rounded">ORDEN #{order.id}</span>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">
                          Fecha: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-CO') : 'Reciente'}
                        </p>
                      </div>
                      <div className="text-right sm:text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase block tracking-wider">Estado Global</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'DELIVERED' || order.status === 'ENTREGADO' ? 'text-emerald-600' :
                          order.status === 'READY_FOR_DELIVERY' ? 'text-amber-500 animate-pulse' : 'text-sabana-blue-light'
                        }`}>
                          {order.status === 'DELIVERED' || order.status === 'ENTREGADO' ? '✓ Entregado' :
                           order.status === 'READY_FOR_DELIVERY' ? '⏰ Listo para Retirar' : '⚙️ En Preparación'}
                        </span>
                      </div>
                    </div>

                    {/* LISTA DE ARTÍCULOS CONTENIDOS EN LA ORDEN */}
                    <div className="space-y-2">
                      {order.items?.map((prod, idx) => {
                        const isDeliveredState = order.status === 'DELIVERED' || order.status === 'ENTREGADO';
                        
                        return (
                          <div key={prod.id || idx} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-2 text-xs">
                              <div>
                                <h5 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1">{prod.title || `Artículo #${prod.productId}`}</h5>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Cantidad: {prod.quantity} u. • Vendedor: {prod.ownerEmail}</p>
                              </div>
                              <p className="font-black text-sabana-blue shrink-0">${(Number(prod.price || 0) * Number(prod.quantity)).toLocaleString('es-CO')}</p>
                            </div>

                            {/* LÓGICA DE CONTROL DE BOTONES EXCLUSIVOS COMPRADOR */}
                            <div className="border-t pt-2 mt-1">
                              
                              {/* CASO 1 Y 2: NO HA SIDO CONFIRMADO COMO ENTREGADO POR COMPRADOR */}
                              {!isDeliveredState && (
                                <div className="space-y-1.5">
                                  <button
                                    disabled={order.status !== 'READY_FOR_DELIVERY'}
                                    onClick={() => handleConfirmDelivery(order.id)}
                                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                      order.status === 'READY_FOR_DELIVERY'
                                        ? 'bg-sabana-blue text-white hover:bg-sabana-blue-hover active:scale-[0.98] shadow-sm cursor-pointer'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                                    }`}
                                  >
                                    Quiero recibir mi producto
                                  </button>
                                  
                                  {order.status !== 'READY_FOR_DELIVERY' && (
                                    <p className="text-[9px] text-slate-400 italic font-bold text-center">
                                      * Bloqueado hasta que el vendedor cambie el estado a "Listo para entregar".
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* CASO 3: EL PEDIDO SE ENCUENTRA EN ESTADO "DELIVERED" -> SE PERMITE CALIFICAR */}
                              {isDeliveredState && (
                                <div className="animate-fadeIn">
                                  {activeReviewProd?.orderId === order.id && activeReviewProd?.productId === prod.id ? (
                                    
                                    /* ENTRADA DEL FORMULARIO DE RESEÑAS */
                                    <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-3 rounded-xl border border-gray-200 mt-2 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Puntúa al Vendedor:</span>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              type="button"
                                              key={star}
                                              onClick={() => setRating(star)}
                                              onMouseEnter={() => setHoverRating(star)}
                                              onMouseLeave={() => setHoverRating(0)}
                                              className="text-amber-400 transition-transform active:scale-125"
                                            >
                                              <Star 
                                                size={16} 
                                                fill={(hoverRating || rating) >= star ? "currentColor" : "none"} 
                                                className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"}
                                              />
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <textarea
                                        rows="2"
                                        maxLength="250"
                                        placeholder="Escribe tu experiencia con la entrega del producto en el campus..."
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:border-sabana-blue outline-none resize-none"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                      />

                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => { setActiveReviewProd(null); setRating(0); setComment(""); }}
                                          className="px-3 py-1.5 bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-lg hover:bg-slate-300 transition-colors"
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={submittingReview}
                                          className="bg-sabana-blue text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-sabana-blue-hover transition-all disabled:opacity-50 shadow-xs"
                                        >
                                          {submittingReview ? 'Guardando...' : 'Enviar Reseña'}
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    
                                    /* ACCESORIO INICIAL: BOTÓN CALIFICAR */
                                    <button
                                      onClick={() => setActiveReviewProd({ orderId: order.id, productId: prod.id, sellerEmail: prod.ownerEmail })}
                                      className="w-full bg-amber-50 hover:bg-amber-100 text-sabana-blue py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-amber-200/60 flex items-center justify-center gap-1.5"
                                    >
                                      <Star size={12} className="fill-current text-amber-500" /> Calificar Servicio del Vendedor
                                    </button>
                                  )}
                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-3 border-t shrink-0">
              <button 
                onClick={() => {
                  setShowHistoryModal(false);
                  setActiveReviewProd(null);
                }}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;