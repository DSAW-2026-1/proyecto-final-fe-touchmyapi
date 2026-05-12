import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CheckCircle, CreditCard, Truck, FileText, ChevronLeft } from 'lucide-react';
import logoSabana from '../assets/sabanalogo.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Sincronizado con tu Contexto (cartItems)
  const { cartItems = [], getCartTotalPrice, clearCart } = useCart();
  
  // Etapas: 'details' | 'shipping' | 'payment' | 'confirmed'
  const [step, setStep] = useState('details'); 

  // Estados del Formulario
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    receiveAtUniversity: false,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    department: '',
    saveInfo: false,
    paymentMethod: 'card', // 'delivery' | 'card'
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalProductsPrice = getCartTotalPrice ? getCartTotalPrice() : 0;
  const shippingCost = 0; 
  const finalTotal = totalProductsPrice + shippingCost;

  return (
    // CORREGIDO: Fondo general ahora usa bg-sabana-light para mantener consistencia
    <div className="min-h-screen bg-sabana-light font-sans antialiased flex flex-col md:flex-row">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIOS DE PASOS */}
      <div className="w-full md:w-7/12 p-6 md:p-16 flex flex-col justify-between bg-white md:rounded-r-3xl md:shadow-lg z-10">
        <div>
          {/* Header minimalista del Checkout */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="bg-sabana-light p-1.5 rounded-xl shadow-sm">
              <img src={logoSabana} alt="Logo Sabana" className="h-9 w-auto object-contain" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-sabana-light flex items-center justify-center text-sabana-blue">
              <ShoppingCart size={16} />
            </div>
          </div>

          {/* Indicador de Rutas de Navegación (Breadcrumbs) */}
          <nav className="text-xs font-medium text-gray-400 flex gap-2 mb-8 items-center select-none">
            <span className={step === 'details' ? 'text-sabana-blue font-bold underline decoration-sabana-softGold decoration-2' : ''}>Carrito</span>
            <span>&gt;</span>
            <span className={step === 'details' ? 'text-sabana-blue font-bold' : 'text-gray-600'}>Detalles</span>
            <span>&gt;</span>
            <span className={step === 'shipping' ? 'text-sabana-blue font-bold' : ''}>Envío</span>
            <span>&gt;</span>
            <span className={step === 'payment' || step === 'confirmed' ? 'text-sabana-blue font-bold' : ''}>Pago</span>
          </nav>

          {/* ================= STEP 1: DETALLES ================= */}
          {step === 'details' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-sabana-blue mb-4">Contacto</h3>
              <input 
                type="text" 
                name="emailOrPhone"
                placeholder="Correo o número de celular" 
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm mb-3 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all"
              />
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-6 select-none">
                <input 
                  type="checkbox" 
                  name="receiveAtUniversity"
                  checked={formData.receiveAtUniversity}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-sabana-blue focus:ring-sabana-blue" 
                />
                Contacto para recibir el pedido en la universidad
              </label>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Datos para el envío</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                <input type="text" name="lastName" placeholder="Second Name" value={formData.lastName} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
              </div>
              <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm mb-3 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
              <input type="text" name="apartment" placeholder="Conjunto, casa, apartamento (opcional)" value={formData.apartment} onChange={handleInputChange} className="w-full p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm mb-3 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <input type="text" name="city" placeholder="Ciudad" value={formData.city} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                <input type="text" name="postalCode" placeholder="Código postal" value={formData.postalCode} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                <select name="department" value={formData.department} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm text-gray-500 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all">
                  <option value="">Departamento</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Bogota">Bogotá D.C.</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-8 select-none">
                <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} className="rounded border-gray-300 text-sabana-blue focus:ring-sabana-blue" />
                Guardar mi información
              </label>

              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <button onClick={() => navigate('/cart')} className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                  Volver al carrito
                </button>
                <button onClick={() => setStep('shipping')} className="bg-sabana-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md">
                  Ir a detalles
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: ENVÍO ================= */}
          {step === 'shipping' && (
            <div className="animate-in fade-in duration-300">
              <div className="border border-gray-200 bg-sabana-light/20 rounded-xl p-4 mb-8 text-sm text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Contacto</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">{formData.emailOrPhone || 'No asignado'}</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Enviar a</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">Universidad de La Sabana, {formData.city || 'Campus Chía'}</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
              </div>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Método de envío</h3>
              <div className="border-2 border-sabana-blue bg-sabana-light/40 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="text-sabana-blue focus:ring-sabana-blue h-4 w-4" />
                  <span className="text-sm font-bold text-sabana-blue">Entrega en La Sabana</span>
                </div>
                <span className="text-sm font-bold text-[#1E293B]">Gratis</span>
              </div>

              <div className="flex justify-between items-center mt-12 border-t pt-4">
                <button onClick={() => setStep('details')} className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                  Volver a detalles
                </button>
                <button onClick={() => setStep('payment')} className="bg-sabana-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md">
                  Ir al pago
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAGO ================= */}
          {step === 'payment' && (
            <div className="animate-in fade-in duration-300">
              <div className="border border-gray-200 bg-sabana-light/20 rounded-xl p-4 mb-8 text-sm text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Contacto</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">{formData.emailOrPhone}</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Enviar a</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">Universidad de La Sabana</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Método</span>
                  <span className="flex-1 text-sabana-blue font-medium">Entrega en la universidad - GRATIS</span>
                  <button onClick={() => setStep('shipping')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
              </div>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Método de pago</h3>
              
              {/* Opción Contraentrega */}
              <div 
                onClick={() => setFormData(p => ({...p, paymentMethod: 'delivery'}))}
                className={`border rounded-xl p-4 mb-3 flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'delivery' ? 'border-sabana-blue bg-sabana-light/30' : 'border-gray-200 bg-white'}`}
              >
                <input type="radio" checked={formData.paymentMethod === 'delivery'} onChange={() => {}} className="text-sabana-blue focus:ring-sabana-blue" />
                <span className="text-sm font-bold text-sabana-blue">Pago contraentrega</span>
              </div>

              {/* Opción Tarjeta */}
              <div className={`border rounded-xl overflow-hidden shadow-sm transition-all ${formData.paymentMethod === 'card' ? 'border-sabana-blue' : 'border-gray-200'}`}>
                <div 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'card'}))}
                  className="bg-sabana-blue text-white p-4 flex items-center gap-3 cursor-pointer"
                >
                  <input type="radio" checked={formData.paymentMethod === 'card'} onChange={() => {}} className="text-white focus:ring-transparent checked:bg-sabana-softGold" />
                  <CreditCard size={18} className="text-sabana-softGold" />
                  <span className="text-sm font-bold tracking-wide">Tarjeta de crédito/débito</span>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-white space-y-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <input type="text" name="cardNumber" placeholder="Número de tarjeta" value={formData.cardNumber} onChange={handleInputChange} className="w-full p-3 border border-gray-300 bg-sabana-light/20 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                    <input type="text" name="cardName" placeholder="Nombre del titular" value={formData.cardName} onChange={handleInputChange} className="w-full p-3 border border-gray-300 bg-sabana-light/20 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" name="cardExpiry" placeholder="Expiración (MM/YY)" value={formData.cardExpiry} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/20 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                      <input type="text" name="cardCvv" placeholder="CVV" value={formData.cardCvv} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/20 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-12 border-t pt-4">
                <button onClick={() => setStep('shipping')} className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                  Volver a envío
                </button>
                <button onClick={() => setStep('confirmed')} className="bg-sabana-blue text-white font-bold py-3.5 px-10 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md tracking-wide">
                  Pagar
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: ORDEN CONFIRMADA ================= */}
          {step === 'confirmed' && (
            <div className="text-center py-8 px-4 animate-in zoom-in duration-300 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-sabana-light rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                <CheckCircle size={56} className="text-sabana-blue" />
              </div>
              <h2 className="text-2xl font-black text-sabana-blue mb-1">Orden confirmada</h2>
              <p className="text-xs font-bold text-sabana-softGold bg-sabana-blue px-3 py-1 rounded-full tracking-wider uppercase mb-6 shadow-sm">ORDEN #2908</p>
              
              <p className="text-[#1E293B] text-sm max-w-md mx-auto leading-relaxed mb-10 font-medium">
                ¡Gracias por tu compra! El tiempo estimado de despacho luego de la confirmación de la orden es de 3 días hábiles. Al contacto proporcionado, te llegará la información respectiva para concretar la entrega de tu pedido.
              </p>

              <button 
                onClick={() => { if(clearCart) clearCart(); navigate('/'); }}
                className="bg-sabana-blue text-white font-bold py-3.5 px-12 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm mb-4 shadow-md"
              >
                Volver al comercio
              </button>
              
              <button className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                Descargar recibo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN LATERAL FIJO (CON FONDO SABANA-LIGHT) */}
      <div className="w-full md:w-5/12 bg-sabana-light/70 p-6 md:p-16 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">Resumen de tu pedido</h3>
          {/* Listado de Productos en Carrito */}
          <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 divide-y divide-gray-200/60">
            {cartItems?.map((item, index) => (
              <div key={item.id} className={`flex items-center gap-4 py-3 ${index === 0 ? '' : 'pt-4'}`}>
                <div className="relative w-16 h-16 bg-white rounded-xl border border-gray-200 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
                  <img src={item.imageUrl || logoSabana} alt={item.title} className="max-w-full max-h-full object-contain rounded-lg" />
                  <span className="absolute -top-2 -right-2 bg-sabana-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-sabana-light">
                    {item.quantity || 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1E293B] line-clamp-2">{item.title}</h4>
                </div>
                <p className="text-sm font-bold text-sabana-blue">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>

          {/* Cálculos */}
          <div className="border-t border-b border-gray-300/70 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-[#1E293B]">{formatCurrency(totalProductsPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Envío</span>
              <span className="text-xs text-gray-400 font-semibold">
                {step === 'details' ? 'Calculado en la siguiente página' : 'Gratis'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5">
            <span className="text-base font-bold text-[#1E293B]">Total</span>
            <span className="text-2xl font-black text-sabana-blue">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;