import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CheckCircle, CreditCard, Truck, FileText, ChevronLeft } from 'lucide-react';
import logoSabana from '../assets/sabanalogo.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Sincronizado con tu Contexto
  const { cartItems = [], getCartTotalPrice, clearCart } = useCart();
  
  // Estados de control
  const [step, setStep] = useState('details'); 
  const [isSubmitting, setIsSubmitting] = useState(false); // CORRECCIÓN 1: Estado definido
  const [errors, setErrors] = useState({});

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
    paymentMethod: 'card', 
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // --- FUNCIONES DE MÁSCARA Y FORMATEO ---
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length > 0 ? parts.join(' ') : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let targetValue = type === 'checkbox' ? checked : value;

    if (name === 'cardNumber') targetValue = formatCardNumber(value).substring(0, 19);
    if (name === 'cardExpiry') targetValue = formatExpiry(value).substring(0, 5);
    if (name === 'cardCvv') targetValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    if (name === 'cardName') targetValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

    setFormData(prev => ({ ...prev, [name]: targetValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // --- SISTEMA DE VALIDACIONES ---
  const validateStep = (currentStep) => {
    let tempErrors = {};

    if (currentStep === 'details') {
      if (!formData.emailOrPhone || !formData.emailOrPhone.trim()) {
        tempErrors.emailOrPhone = "El correo electrónico es obligatorio.";
      }
      if (!formData.firstName || !formData.firstName.trim()) tempErrors.firstName = "El nombre es obligatorio.";
      if (!formData.lastName || !formData.lastName.trim()) tempErrors.lastName = "El apellido es obligatorio.";
      if (!formData.address || !formData.address.trim()) tempErrors.address = "La dirección de entrega es obligatoria.";
      if (!formData.city || !formData.city.trim()) tempErrors.city = "La ciudad es obligatoria.";

      if (formData.emailOrPhone && formData.emailOrPhone.trim()) {
        const sabanaEmailRegex = /^[a-zA-Z0-9._%+-]+@unisabana\.edu\.co$/;
        if (isNaN(formData.emailOrPhone.trim()) && !sabanaEmailRegex.test(formData.emailOrPhone.trim())) {
          tempErrors.emailOrPhone = "Debes usar un correo institucional válido (@unisabana.edu.co).";
        }
      }
    }

    if (currentStep === 'payment' && formData.paymentMethod === 'card') {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      if (!cleanCardNumber) tempErrors.cardNumber = "El número de tarjeta es obligatorio.";
      else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 16) tempErrors.cardNumber = "Número de tarjeta inválido.";

      if (!formData.cardName || !formData.cardName.trim()) tempErrors.cardName = "El nombre del titular es obligatorio.";
      
      if (!formData.cardExpiry) tempErrors.cardExpiry = "La fecha de expiración es obligatoria.";
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) tempErrors.cardExpiry = "Formato MM/YY.";
      else {
        const [monthStr, yearStr] = formData.cardExpiry.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10) + 2000;
        const currentDate = new Date();
        if (month < 1 || month > 12) tempErrors.cardExpiry = "Mes inválido.";
        else if (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month < (currentDate.getMonth() + 1))) {
          tempErrors.cardExpiry = "Tarjeta vencida.";
        }
      }

      if (!formData.cardCvv) tempErrors.cardCvv = "CVV obligatorio.";
      else if (formData.cardCvv.length < 3 || formData.cardCvv.length > 4) tempErrors.cardCvv = "CVV inválido.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- MANEJADORES DE ENVÍO (SUBMIT) ---
  
  // CORRECCIÓN 2: Función para manejar el primer paso agregada
  const handleSubmitDetails = (e) => {
    e.preventDefault();
    if (validateStep('details')) {
      setStep('shipping');
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (validateStep('payment')) {
      setIsSubmitting(true);

      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: Number(item.price)
      }));

      const orderData = {
        email: formData.emailOrPhone,
        items: orderItems,
        totalPrice: Number(finalTotal),
        status: "COMPLETED"
      };

      try {
        // CORRECCIÓN 3: Referencia correcta a import.meta.env
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          if (clearCart) clearCart(); 
          setStep('confirmed');
        } else {
          const errorMessage = await response.text();
          alert(`Error al procesar la compra: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
      } finally {
        setIsSubmitting(false);
      }
    }
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
    <div className="min-h-screen bg-sabana-light font-sans antialiased flex flex-col md:flex-row">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIOS */}
      <div className="w-full md:w-7/12 p-6 md:p-16 flex flex-col justify-between bg-white md:rounded-r-3xl md:shadow-lg z-10">
        <div>
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="bg-sabana-light p-1.5 rounded-xl shadow-sm">
              <img src={logoSabana} alt="Logo Sabana" className="h-9 w-auto object-contain" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-sabana-light flex items-center justify-center text-sabana-blue">
              <ShoppingCart size={16} />
            </div>
          </div>

          <nav className="text-xs font-medium text-gray-400 flex gap-2 mb-8 items-center select-none">
            <span className={step === 'details' ? 'text-sabana-blue font-bold underline decoration-sabana-softGold' : ''}>Carrito</span>
            <span>&gt;</span>
            <span className={step === 'details' ? 'text-sabana-blue font-bold' : 'text-gray-600'}>Detalles</span>
            <span>&gt;</span>
            <span className={step === 'shipping' ? 'text-sabana-blue font-bold' : ''}>Envío</span>
            <span>&gt;</span>
            <span className={step === 'payment' || step === 'confirmed' ? 'text-sabana-blue font-bold' : ''}>Pago</span>
          </nav>

          {/* STEP 1: DETALLES */}
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-sabana-blue mb-4">Contacto</h3>
              <div className="mb-3">
                <input 
                  type="text" 
                  name="emailOrPhone"
                  placeholder="Correo institucional o número de celular" 
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl text-sm focus:outline-none transition-all ${
                    errors.emailOrPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'
                  }`}
                />
                {errors.emailOrPhone && <p className="text-red-500 text-[11px] font-bold mt-1.5 px-1">{errors.emailOrPhone}</p>}
              </div>
              
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-6 select-none">
                <input type="checkbox" name="receiveAtUniversity" checked={formData.receiveAtUniversity} onChange={handleInputChange} className="rounded border-gray-300 text-sabana-blue" />
                Contacto para recibir el pedido en la universidad
              </label>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Datos para el envío</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/30'}`} />
                  {errors.firstName && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/30'}`} />
                  {errors.lastName && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mb-3">
                <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/30'}`} />
                {errors.address && <p className="text-red-500 text-[11px] font-bold mt-1.5 px-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="col-span-1">
                  <input type="text" name="city" placeholder="Ciudad" value={formData.city} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/30'}`} />
                  {errors.city && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.city}</p>}
                </div>
                <input type="text" name="postalCode" placeholder="C.P." value={formData.postalCode} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm" />
                <select name="department" value={formData.department} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm">
                  <option value="">Depto</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Bogota">Bogotá D.C.</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <button type="button" onClick={() => navigate('/cart')} className="text-sabana-blue text-xs font-bold underline">Volver al carrito</button>
                <button type="submit" className="bg-sabana-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md">Ir a envío</button>
              </div>
            </form>
          )}

          {/* STEP 2: ENVÍO */}
          {step === 'shipping' && (
            <div className="animate-in fade-in duration-300">
              <div className="border border-gray-200 bg-sabana-light/20 rounded-xl p-4 mb-8 text-sm text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Contacto</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">{formData.emailOrPhone}</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline">Editar</button>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Enviar a</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">{formData.address}, {formData.city}</span>
                  <button onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline">Editar</button>
                </div>
              </div>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Método de envío</h3>
              <div className="border-2 border-sabana-blue bg-sabana-light/40 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="text-sabana-blue h-4 w-4" />
                  <span className="text-sm font-bold text-sabana-blue">Entrega en La Sabana</span>
                </div>
                <span className="text-sm font-bold text-slate-800">Gratis</span>
              </div>

              <div className="flex justify-between items-center mt-12 border-t pt-4">
                <button onClick={() => setStep('details')} className="text-sabana-blue text-xs font-bold underline">Volver a detalles</button>
                <button onClick={() => setStep('payment')} className="bg-sabana-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md">Ir al pago</button>
              </div>
            </div>
          )}

          {/* STEP 3: PAGO */}
          {step === 'payment' && (
            <form onSubmit={handleSubmitPayment} className="animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-sabana-blue mb-4">Método de pago</h3>
              
              <div 
                onClick={() => setFormData(p => ({...p, paymentMethod: 'delivery'}))}
                className={`border rounded-xl p-4 mb-3 flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'delivery' ? 'border-sabana-blue bg-sabana-light/30' : 'border-gray-200'}`}
              >
                <input type="radio" checked={formData.paymentMethod === 'delivery'} onChange={() => {}} className="text-sabana-blue" />
                <span className="text-sm font-bold text-sabana-blue">Pago contraentrega</span>
              </div>

              <div className={`border rounded-xl overflow-hidden shadow-sm transition-all ${formData.paymentMethod === 'card' ? 'border-sabana-blue' : 'border-gray-200'}`}>
                <div 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'card'}))}
                  className="bg-sabana-blue text-white p-4 flex items-center gap-3 cursor-pointer"
                >
                  <input type="radio" checked={formData.paymentMethod === 'card'} onChange={() => {}} className="text-white" />
                  <CreditCard size={18} className="text-sabana-softGold" />
                  <span className="text-sm font-bold tracking-wide">Tarjeta de crédito/débito</span>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-white space-y-3 border-t border-gray-100">
                    <div>
                      <input type="text" name="cardNumber" placeholder="Número de tarjeta" value={formData.cardNumber} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/20'}`} />
                      {errors.cardNumber && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <input type="text" name="cardName" placeholder="Nombre en tarjeta" value={formData.cardName} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.cardName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/20'}`} />
                      {errors.cardName && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input type="text" name="cardExpiry" placeholder="MM/YY" value={formData.cardExpiry} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.cardExpiry ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/20'}`} />
                        {errors.cardExpiry && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <input type="password" name="cardCvv" placeholder="CVV" value={formData.cardCvv} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none ${errors.cardCvv ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-sabana-light/20'}`} />
                        {errors.cardCvv && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-12 border-t pt-4">
                <button type="button" onClick={() => setStep('shipping')} className="text-sabana-blue text-xs font-bold underline">Volver a envío</button>
                <button type="submit" disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-sabana-blue'} text-white font-bold py-3.5 px-10 rounded-xl text-sm shadow-md transition-all`}>
                  {isSubmitting ? "Procesando..." : "Finalizar Pago"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMACIÓN */}
          {step === 'confirmed' && (
            <div className="text-center py-8 px-4 animate-in zoom-in flex flex-col items-center">
              <div className="w-20 h-20 bg-sabana-light rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle size={56} className="text-sabana-blue" />
              </div>
              <h2 className="text-2xl font-black text-sabana-blue mb-1">Orden confirmada</h2>
              <p className="text-xs font-bold text-sabana-softGold bg-sabana-blue px-3 py-1 rounded-full mb-6 uppercase">ORDEN #2908</p>
              <p className="text-slate-800 text-sm max-w-md mx-auto leading-relaxed mb-10 font-medium">¡Gracias por tu compra! El tiempo estimado de entrega en el campus es de 3 días hábiles.</p>
              <button type="button" onClick={() => { clearCart?.(); navigate('/'); }} className="bg-sabana-blue text-white font-bold py-3.5 px-12 rounded-xl text-sm shadow-md">Volver al comercio</button>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN */}
      <div className="w-full md:w-5/12 bg-sabana-light/70 p-6 md:p-16 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">Resumen de tu pedido</h3>
          <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto divide-y divide-gray-200/60">
            {cartItems?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className="relative w-16 h-16 bg-white rounded-xl border border-gray-200 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
                  <img src={item.imageUrl || logoSabana} alt={item.title} className="max-w-full max-h-full object-contain rounded-lg" />
                  <span className="absolute -top-2 -right-2 bg-sabana-blue text-white text-[10px] font-bold w-5 h-5 rounded-full border-2 border-sabana-light flex items-center justify-center">
                    {item.quantity || 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{item.title}</h4>
                </div>
                <p className="text-sm font-bold text-sabana-blue">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-b border-gray-300/70 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-800">{formatCurrency(totalProductsPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Envío</span>
              <span className="text-xs text-gray-400 font-semibold">Gratis</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5">
            <span className="text-base font-bold text-slate-800">Total</span>
            <span className="text-2xl font-black text-sabana-blue">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;