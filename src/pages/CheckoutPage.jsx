import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, CheckCircle, CreditCard, Truck, FileText, ChevronLeft, AlertTriangle } from 'lucide-react';
import logoSabana from '../assets/sabanalogo.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Sincronizado con tu Contexto Global
  const { cartItems = [], getCartTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  // Estados de control de flujo observados en el vídeo
  const [step, setStep] = useState('details'); // 'details' | 'shipping' | 'payment' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [realOrderId, setRealOrderId] = useState(''); // ID real retornado por el backend

  // Estado del formulario adaptado fielmente a la información del vídeo
  const [formData] = useState({
    name: user?.name || 'Juan',
    lastName: user?.lastName || 'Silva',
    email: user?.email || 'juanmorsi@unisabana.edu.co',
    place: 'Universidad de La Sabana (Entrega Presencial en Campus)',
    address: 'Campus Universitario, Km 7 Autopista Norte',
    city: 'Chía',
    department: 'Cundinamarca',
    postalCode: '250001'
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const totalProductsPrice = getCartTotalPrice();

  // Redirección protectora si entran con la bolsa vacía
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      navigate('/publicshowcase');
    }
  }, [cartItems, step, navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Envío sincronizado con el Backend y el mapeo del ownerEmail
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedItems = cartItems.map(item => ({
      productId: Number(item.id),
      quantity: Number(item.quantity),
      price: Number(item.price),
      title: item.title,
      imageUrl: item.imageUrl || '',
      ownerEmail: item.ownerEmail || item.owner || '' 
    }));

    const orderPayload = {
      email: formData.email.toLowerCase().trim(),
      address: formData.address,
      city: formData.city,
      paymentMethod: "Contraentrega",
      totalAmount: totalProductsPrice,
      items: formattedItems
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setRealOrderId(savedOrder.id || Math.floor(1000 + Math.random() * 9000));
        clearCart();
        setStep('success');
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
    <div className="min-h-screen bg-sabana-light font-roboto flex flex-col pb-12">
      {/* HEADER INSTITUCIONAL CON COLORES SABANA */}
      <header className="bg-sabana-blue text-white py-4 px-6 shadow-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/publicshowcase')}>
          <img src={logoSabana} alt="Logo" className="h-9 w-auto bg-white p-1 rounded-lg" />
          <h1 className="text-base font-roboto-slab font-black uppercase tracking-wider">Pasarela de Compra</h1>
        </div>
        {step !== 'success' && (
          <button 
            onClick={() => navigate('/publicshowcase')}
            className="text-xs font-black uppercase tracking-wider flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={16} /> Volver
          </button>
        )}
      </header>

      {/* INDICADOR DE PASOS SUPERIORES DEL VIDEO (APLICANDO FUENTES Y COLORES ESTABLECIDOS) */}
      {step !== 'success' && (
        <div className="max-w-7xl w-full mx-auto px-4 mt-6">
          <div className="flex items-center gap-2 max-w-xl text-center select-none">
            <div className="flex items-center gap-2 flex-1">
              <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-full border ${step === 'details' ? 'bg-sabana-blue text-white border-transparent' : 'bg-emerald-500 text-white border-transparent'}`}>{step === 'details' ? '1' : '✓'}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'details' ? 'text-slate-800' : 'text-gray-400'}`}>1. Detalles</span>
            </div>
            <div className="h-[2px] w-8 bg-gray-200" />
            <div className="flex items-center gap-2 flex-1">
              <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-full border ${step === 'shipping' ? 'bg-sabana-blue text-white border-transparent' : step === 'payment' ? 'bg-emerald-500 text-white border-transparent' : 'bg-white text-gray-400 border-gray-200'}`}>{step === 'payment' ? '✓' : '2'}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'shipping' ? 'text-slate-800' : 'text-gray-400'}`}>2. Envío</span>
            </div>
            <div className="h-[2px] w-8 bg-gray-200" />
            <div className="flex items-center gap-2 flex-1">
              <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-full border ${step === 'payment' ? 'bg-sabana-blue text-white border-transparent' : 'bg-white text-gray-400 border-gray-200'}`}>3</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'payment' ? 'text-slate-800' : 'text-gray-400'}`}>3. Pago</span>
            </div>
            <div className="h-[2px] w-8 bg-gray-200" />
            <div className="flex items-center gap-2 flex-1">
              <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-full border bg-white text-gray-400 border-gray-200">4</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">4. Confirmación</span>
            </div>
          </div>
        </div>
      )}

      {/* GRID EN DOS COLUMNAS */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* BLOQUE IZQUIERDO: FORMULARIOS CON FORMATO TAILWIND PROPIO */}
        {step !== 'success' && (
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sabana-card border border-gray-100 space-y-5">
            
            {/* 1. PASO DETALLES */}
            {step === 'details' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b pb-2">
                  <FileText className="text-sabana-blue" size={18} />
                  <h3 className="font-roboto-slab font-black text-slate-800 text-sm uppercase tracking-wide">Información Personal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Nombre</label>
                    <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-500 cursor-not-allowed outline-none" value={formData.name} />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Apellido</label>
                    <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-500 cursor-not-allowed outline-none" value={formData.lastName} />
                  </div>
                </div>
                <div className="text-xs">
                  <label className="block text-gray-400 font-bold uppercase mb-1">Correo Institucional</label>
                  <input type="email" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-500 cursor-not-allowed outline-none" value={formData.email} />
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setStep('shipping')}
                    className="bg-sabana-blue hover:bg-sabana-blue-hover text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.99]"
                  >
                    Continuar al Envío
                  </button>
                </div>
              </div>
            )}

            {/* 2. PASO ENVÍO */}
            {step === 'shipping' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Truck className="text-sabana-blue" size={18} />
                  <h3 className="font-roboto-slab font-black text-slate-800 text-sm uppercase tracking-wide">Punto de Entrega Autorizado</h3>
                </div>
                
                <div className="bg-sabana-light/30 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                  <Truck className="text-sabana-blue shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Por políticas del marketplace estudiantil, todas las entregas se realizan de forma segura y presencial dentro de las instalaciones del campus.
                  </p>
                </div>

                <div className="text-xs space-y-4">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Lugar de Entrega</label>
                    <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" value={formData.place} />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Dirección del Campus</label>
                    <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" value={formData.address} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase mb-1">Ciudad</label>
                      <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" value={formData.city} />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold uppercase mb-1">Departamento</label>
                      <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" value={formData.department} />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold uppercase mb-1">Código Postal</label>
                      <input type="text" readOnly className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" value={formData.postalCode} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setStep('details')}
                    className="text-xs font-black uppercase text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={() => setStep('payment')}
                    className="bg-sabana-blue hover:bg-sabana-blue-hover text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.99]"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </div>
            )}

            {/* 3. PASO PAGO */}
            {step === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b pb-2">
                  <CreditCard className="text-sabana-blue" size={18} />
                  <h3 className="font-roboto-slab font-black text-slate-800 text-sm uppercase tracking-wide">Método de Pago Seleccionado</h3>
                </div>
                
                <div className="border-2 border-sabana-blue bg-sabana-light/30 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-white border rounded-xl text-slate-700 shadow-xs">
                      <CreditCard size={18} className="text-sabana-blue" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">Pago Contraentrega (COD)</h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">Paga en efectivo o Nequi/Daviplata al recibir tu producto en la Universidad.</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-sabana-blue flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setStep('shipping')}
                    className="text-xs font-black uppercase text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar y Finalizar'}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* PANTALLA EXCLUSIVA DE ÉXITO TRAS CONFIRMACIÓN */}
        {step === 'success' && (
          <div className="col-span-12 max-w-xl mx-auto w-full bg-white p-8 rounded-3xl shadow-sabana-card border border-emerald-100 text-center space-y-6 mt-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
              <CheckCircle size={32} />
            </div>
            
            <div className="space-y-1">
              <h2 className="font-roboto-slab font-black text-slate-800 text-xl uppercase tracking-wide">¡Pedido Generado Exitosamente!</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Código de Rastreo: <span className="text-sabana-blue font-black"># {realOrderId}</span></p>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              Le hemos notificado por medio de WebSockets en tiempo real al vendedor del artículo. Mantente atento a tu correo o celular para acordar la hora exacta del encuentro en el campus.
            </p>

            {/* SECCIÓN REQUERIDA DE ADVERTENCIA CON COLORES DE ALERTA ALINEADOS */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-1.5 text-amber-800 font-black text-[10px] uppercase tracking-wider">
                <AlertTriangle size={14} className="text-amber-500 shrink-0" /> Recordatorios:
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium list-disc list-inside">
                <li>
                  <span className="font-black text-slate-800">Debes confirmar la entrega</span> desde tu historial de compras en el perfil de usuario una vez el producto esté listo y el vendedor te lo entregue en físico.
                </li>
                <li>
                  Recuerda que la compra es un compromiso formal entre estudiantes, por lo tanto, <span className="font-black text-rose-600 uppercase tracking-tight">no se puede cancelar</span>.
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => navigate('/userprofile')}
                className="bg-sabana-blue hover:bg-sabana-blue-hover text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.98]"
              >
                Ir a Mi Perfil (Historial)
              </button>
            </div>
          </div>
        )}

        {/* COLUMNA DERECHA: RESUMEN LATERAL COMPACTO DEL CARRITO */}
        {step !== 'success' && (
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl shadow-sabana-card border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <ShoppingCart className="text-gray-400" size={16} />
              <h4 className="font-roboto-slab font-black text-slate-700 text-xs uppercase tracking-wider">Resumen del Carrito</h4>
            </div>

            {/* ITEMS DEL CARRITO */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50/50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-white border rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      <img src={item.imageUrl || logoSabana} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 uppercase tracking-tight truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold">Cant: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-sabana-blue shrink-0 pl-2">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* DESGLOSE ECONÓMICO */}
            <div className="pt-2 space-y-2.5 text-xs border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Subtotal Productos</span>
                <span className="font-black text-slate-700">{formatCurrency(totalProductsPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Costo de Envío</span>
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Gratis (En Campus)</span>
              </div>
              <div className="h-[1px] bg-gray-100 my-2" />
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black text-sabana-blue uppercase tracking-wider">Monto a pagar contra entrega</span>
                  <span className="text-lg font-black text-slate-900 tracking-tight">{formatCurrency(totalProductsPrice)}</span>
                </div>
                <p className="text-[9px] text-right text-gray-400 font-bold leading-none">
                  * No se requieren transacciones digitales previas.
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