import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, CheckCircle, CreditCard, Truck, FileText, ChevronLeft } from 'lucide-react';
import logoSabana from '../assets/sabanalogo.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Sincronizado con tu Contexto
  const { cartItems = [], getCartTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  // Estados de control
  const [step, setStep] = useState('details'); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [errors, setErrors] = useState({});
  const [realOrderId, setRealOrderId] = useState(''); // Guarda el ID real retornado por el backend

  // Estados del Formulario con datos quemados e inicializados de forma limpia
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name || '',
    lastName: user?.lastName || '',
    // Datos de envío quemados para la Universidad de La Sabana
    address: 'Campus Universitario, Km 7 Autopista Norte',
    apartment: 'Edificio de Ciencias o Lugar de Encuentro en Campus',
    city: 'Chía',
    postalCode: '250001',
    department: 'Cundinamarca',
    receiveAtUniversity: true,
    paymentMethod: 'cod', // 'cod' = Cash on Delivery (Contraentrega) como único método
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const totalProductsPrice = getCartTotalPrice();

  // Redirección si el carrito está vacío y no estamos en la confirmación
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'confirmation') {
      navigate('/publicshowcase');
    }
  }, [cartItems, step, navigate]);

  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString('es-CO')}`;
  };

  // Manejo de navegación de pasos con validaciones sencillas
  const handleNextStep = (nextStep) => {
    setErrors({});
    if (step === 'details') {
      if (!formData.email) {
        setErrors({ email: 'El correo electrónico es requerido' });
        return;
      }
    }
    setStep(nextStep);
  };

  // Envío final de la orden al Backend
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      email: formData.email,
      address: formData.address,
      city: formData.city,
      paymentMethod: "Contraentrega",
      totalAmount: totalProductsPrice,
      items: cartItems.map(item => ({
        ...item,              
        productId: item.id    
      }))
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        // Cuarto Punto: Capturamos el ID incremental real generado en el backend
        setRealOrderId(savedOrder.id || 'N/A');
        clearCart();
        setStep('confirmation');
      } else {
        const errorText = await response.text();
        alert(`Error al procesar la orden: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor:", error);
      alert("Hubo un error de red al procesar tu orden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sabana-light font-roboto flex flex-col">
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-sabana-blue text-white py-4 px-6 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoSabana} alt="Logo Sabana" className="h-10 w-auto bg-white p-1 rounded-lg" />
          <h1 className="text-xl font-roboto-slab font-black uppercase tracking-wider">Marketplace Sabana</h1>
        </div>
        
        {/* Quinto Punto: Botón para volver al carrito (Deshabilitado en la pantalla de confirmación) */}
        <button
          onClick={() => navigate('/cart-page')}
          disabled={step === 'confirmation'}
          className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl border
            ${step === 'confirmation' 
              ? 'opacity-40 cursor-not-allowed border-white/20 text-white/40' 
              : 'border-white/30 text-sabana-blue-light bg-white/5 hover:bg-white/10 hover:text-white'}`}
        >
          <ChevronLeft size={16} /> Volver al Carrito
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BLOQUE IZQUIERDO: PROCESO DE PAGO (8 Columnas) */}
        <div className={`${step === 'confirmation' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
          
          {/* INDICADOR DE PASOS (STEPPER) */}
          <div className="bg-white p-4 rounded-3xl shadow-sabana-card flex justify-between items-center overflow-x-auto gap-4">
            {[
              { id: 'details', label: 'Detalles', icon: FileText },
              { id: 'shipping', label: 'Envío', icon: Truck },
              { id: 'payment', label: 'Pago', icon: CreditCard },
              { id: 'confirmation', label: 'Confirmación', icon: CheckCircle }
            ].map((s, index, arr) => {
              const IconComponent = s.icon;
              const isActive = step === s.id;
              const isPast = arr.findIndex(item => item.id === step) > index;
              
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all font-bold text-xs
                      ${isActive ? 'bg-sabana-blue text-white shadow-lg scale-105' : ''}
                      ${isPast ? 'bg-emerald-500 text-white' : ''}
                      ${!isActive && !isPast ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
                      {isPast ? <CheckCircle size={14} /> : index + 1}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest hidden sm:inline
                      ${isActive ? 'text-sabana-blue' : 'text-gray-400'}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 rounded-full hidden sm:block transition-colors duration-300
                      ${isPast ? 'bg-emerald-500' : 'bg-gray-200'}`} 
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* PASO 1: DETALLES (Nombre, Apellido y Correo Quemados) */}
          {step === 'details' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sabana-card space-y-6 animate-fadeIn">
              <h2 className="text-xl font-roboto-slab font-black text-sabana-blue uppercase tracking-wider border-b border-gray-100 pb-3">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nombre</label>
                  <input 
                    type="text" 
                    value={formData.firstName} 
                    disabled 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Apellido</label>
                  <input 
                    type="text" 
                    value={formData.lastName} 
                    disabled 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Correo Institucional</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold cursor-not-allowed outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => handleNextStep('shipping')}
                  className="bg-sabana-blue text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover active:scale-[0.98] transition-all shadow-md"
                >
                  Continuar al Envío
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: ENVÍO (Ubicación de La Sabana Quemada Completamente) */}
          {step === 'shipping' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sabana-card space-y-6 animate-fadeIn">
              <h2 className="text-xl font-roboto-slab font-black text-sabana-blue uppercase tracking-wider border-b border-gray-100 pb-3">
                Punto de Entrega Autorizado
              </h2>
              
              <div className="p-4 bg-sabana-light/50 border border-sabana-blue-light/40 rounded-2xl flex items-start gap-3">
                <Truck className="text-sabana-blue mt-0.5 shrink-0" size={18} />
                <p className="text-xs text-sabana-blue font-medium leading-relaxed">
                  Por políticas del marketplace estudiantil, todas las entregas se realizan de forma segura y presencial dentro de las instalaciones del campus.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Lugar de Entrega</label>
                  <input 
                    type="text" 
                    value="Universidad de La Sabana (Entrega Presencial en Campus)" 
                    disabled 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl text-sm font-extrabold cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Dirección del Campus</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    disabled 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-medium cursor-not-allowed outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ciudad</label>
                    <input type="text" value={formData.city} disabled className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-medium cursor-not-allowed outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Departamento</label>
                    <input type="text" value={formData.department} disabled className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-medium cursor-not-allowed outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Código Postal</label>
                    <input type="text" value={formData.postalCode} disabled className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-medium cursor-not-allowed outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button 
                  onClick={() => setStep('details')}
                  className="border border-gray-200 text-gray-500 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Atrás
                </button>
                <button 
                  onClick={() => handleNextStep('payment')}
                  className="bg-sabana-blue text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover active:scale-[0.98] transition-all shadow-md"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: PAGO (Único Método Admitido: Contraentrega) */}
          {step === 'payment' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sabana-card space-y-6 animate-fadeIn">
              <h2 className="text-xl font-roboto-slab font-black text-sabana-blue uppercase tracking-wider border-b border-gray-100 pb-3">
                Método de Pago Seleccionado
              </h2>
              
              <div className="p-4 rounded-2xl border-2 border-sabana-blue bg-sabana-light/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sabana-blue text-white flex items-center justify-center">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-sabana-blue uppercase tracking-wider">Pago Contraentrega (COD)</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Paga en efectivo o Nequi/Daviplata al recibir tu producto en la Universidad.</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-sabana-blue bg-white flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-sabana-blue" />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button 
                  onClick={() => setStep('shipping')}
                  className="border border-gray-200 text-gray-500 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Atrás
                </button>
                <button 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`bg-emerald-500 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600 active:scale-[0.98]'}`}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar y Finalizar'}
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: PANTALLA DE CONFIRMACIÓN */}
          {step === 'confirmation' && (
            <div className="bg-white p-8 rounded-3xl shadow-sabana-card text-center space-y-6 animate-scaleIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-roboto-slab font-black text-slate-800 uppercase tracking-wide">¡Orden Confirmada con Éxito!</h2>
                {/* Cuarto Punto: Muestra el ID numérico real retornado de tu db en memoria */}
                <p className="text-sm text-gray-500 font-bold">
                  Número de Orden: <span className="text-sabana-blue font-black bg-sabana-light/50 px-3 py-1 rounded-xl text-xs border border-sabana-blue-light/30">#00{realOrderId}</span>
                </p>
              </div>
              
              {/* Cuarto Punto: Mensaje modificado exactamente según lo requerido */}
              <p className="text-sm text-gray-600 font-medium max-w-lg mx-auto leading-relaxed bg-slate-50 p-4 rounded-2xl border border-gray-100">
                ¡Gracias por tu compra! El vendedor se comunicará contigo para los detalles de la fecha de entrega, sin embargo, tenga la certeza de que su producto será entregado en un plazo de 4 días hábiles como máximo.
              </p>

              <div className="pt-4">
                <button 
                  onClick={() => navigate('/publicshowcase')}
                  className="bg-sabana-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover transition-all shadow-md"
                >
                  Volver al Catálogo Principal
                </button>
              </div>
            </div>
          )}

        </div>

        {/* BLOQUE DERECHO: RESUMEN DE LA COMPRA (4 Columnas) */}
        {step !== 'confirmation' && (
          <div className="lg:col-span-4 space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl shadow-sabana-card space-y-6 sticky top-24">
              <h3 className="text-base font-roboto-slab font-black text-sabana-blue uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShoppingCart size={18} /> Resumen del Carrito
              </h3>

              {/* LISTADO DE ARTÍCULOS */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 bg-slate-50 p-2.5 rounded-2xl border border-gray-100/50">
                    
                    
                    <div className="relative shrink-0">
                      
                     
                      <div className="bg-white w-14 h-14 rounded-xl border border-gray-200/60 overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : logoSabana} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = logoSabana;
                          }}
                        />
                      </div>

                      
                      <span className="absolute -top-1.5 -right-1.5 bg-sabana-blue text-white text-[10px] font-black w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-10">
                        {item.quantity || 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-800 line-clamp-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 font-bold mt-0.5">{formatCurrency(item.price)} c/u</p>
                    </div>
                    <p className="text-xs font-black text-sabana-blue shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* DESGLOSE DE COSTOS */}
              <div className="border-t border-b border-gray-100 py-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-black uppercase tracking-wider">Subtotal Productos</span>
                  <span className="font-extrabold text-slate-800">{formatCurrency(totalProductsPrice)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-black uppercase tracking-wider">Costo de Envío</span>
                  <span className="text-xs text-emerald-500 font-black uppercase tracking-widest">Gratis (En Campus)</span>
                </div>
              </div>

              {/* TOTAL AJUSTADO A CONTRAENTREGA */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black text-sabana-blue uppercase tracking-widest">Monto a pagar contra entrega</span>
                  <span className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(totalProductsPrice)}</span>
                </div>
                <p className="text-[10px] text-right text-gray-400 font-bold">
                  * No se requiere transacciones digitales previas.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;