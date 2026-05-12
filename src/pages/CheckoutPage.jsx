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

  // Estado para capturar las alertas de validación por campo
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
    paymentMethod: 'card', // 'delivery' | 'card'
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // --- FUNCIONES DE MÁSCARA Y FORMATEO EN TIEMPO REAL ---
  const formatCardNumber = (value) => {
    // Deja solo números y agrupa de a 4 separados por un espacio
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    // Deja solo números y añade un '/' automático después del segundo dígito
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let targetValue = type === 'checkbox' ? checked : value;

    // Aplicar formateadores avanzados según el campo de la tarjeta
    if (name === 'cardNumber') targetValue = formatCardNumber(value).substring(0, 19); // Máximo 16 números + 3 espacios
    if (name === 'cardExpiry') targetValue = formatExpiry(value).substring(0, 5);     // Formato MM/YY
    if (name === 'cardCvv') targetValue = value.replace(/[^0-9]/g, '').substring(0, 4); // Solo números, máx 4 dígitos
    if (name === 'cardName') targetValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios

    setFormData(prev => ({
      ...prev,
      [name]: targetValue
    }));

    // Limpia el indicador visual del error en tiempo real
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // --- SISTEMA DE VALIDACIONES ROBUSTO ---
  const validateStep = (currentStep) => {
    let tempErrors = {};

    // --- VALIDACIONES PASO 1 (DETALLES) ---
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

    // --- NUEVAS VALIDACIONES PASO 3 (TARJETA DE CRÉDITO) ---
    if (currentStep === 'payment' && formData.paymentMethod === 'card') {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      
      // 1. Validar Número de Tarjeta (Longitud estándar 13 a 16 dígitos)
      if (!cleanCardNumber) {
        tempErrors.cardNumber = "El número de tarjeta es obligatorio.";
      } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 16) {
        tempErrors.cardNumber = "Número de tarjeta inválido (debe tener entre 13 y 16 dígitos).";
      }

      // 2. Validar Titular de la Tarjeta
      if (!formData.cardName || !formData.cardName.trim()) {
        tempErrors.cardName = "El nombre del titular es obligatorio.";
      } else if (formData.cardName.trim().length < 3) {
        tempErrors.cardName = "Por favor ingresa el nombre completo del titular.";
      }

      // 3. Validar Fecha de Expiración (MM/YY) lógica y temporal
      if (!formData.cardExpiry) {
        tempErrors.cardExpiry = "La fecha de expiración es obligatoria.";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        tempErrors.cardExpiry = "Formato inválido (Use MM/YY).";
      } else {
        const [monthStr, yearStr] = formData.cardExpiry.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10) + 2000; // Convierte "26" en 2026

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Enero es 0
        const currentYear = currentDate.getFullYear();

        if (month < 1 || month > 12) {
          tempErrors.cardExpiry = "Mes inválido (Debe ser 01-12).";
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          tempErrors.cardExpiry = "La tarjeta ya se encuentra vencida.";
        }
      }

      // 4. Validar Código de Seguridad (CVV)
      if (!formData.cardCvv) {
        tempErrors.cardCvv = "El código CVV es obligatorio.";
      } else if (formData.cardCvv.length < 3 || formData.cardCvv.length > 4) {
        tempErrors.cardCvv = "CVV inválido (Debe tener 3 o 4 dígitos).";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    if (validateStep('details')) setStep('shipping');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (validateStep('payment')) {
      // Simulación de envío exitoso / Integración lista para Spring Boot
      setStep('confirmed');
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
      
      {/* SECCIÓN IZQUIERDA: FORMULARIOS DE PASOS */}
      <div className="w-full md:w-7/12 p-6 md:p-16 flex flex-col justify-between bg-white md:rounded-r-3xl md:shadow-lg z-10">
        <div>
          {/* Header minimalista */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="bg-sabana-light p-1.5 rounded-xl shadow-sm">
              <img src={logoSabana} alt="Logo Sabana" className="h-9 w-auto object-contain" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-sabana-light flex items-center justify-center text-sabana-blue">
              <ShoppingCart size={16} />
            </div>
          </div>

          {/* Breadcrumbs */}
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
            <form onSubmit={handleSubmitDetails} className="animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-sabana-blue mb-4">Contacto</h3>
              <div className="mb-3">
                <input 
                  type="text" 
                  name="emailOrPhone"
                  placeholder="Correo institucional o número de celular" 
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                    errors.emailOrPhone ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'
                  }`}
                />
                {errors.emailOrPhone && <p className="text-error-red text-[11px] font-bold mt-1.5 px-1">{errors.emailOrPhone}</p>}
              </div>
              
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-6 select-none">
                <input type="checkbox" name="receiveAtUniversity" checked={formData.receiveAtUniversity} onChange={handleInputChange} className="rounded border-gray-300 text-sabana-blue focus:ring-sabana-blue" />
                Contacto para recibir el pedido en la universidad
              </label>

              <h3 className="text-base font-bold text-sabana-blue mb-4">Datos para el envío</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${errors.firstName ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'}`} />
                  {errors.firstName && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${errors.lastName ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'}`} />
                  {errors.lastName && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mb-3">
                <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${errors.address ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'}`} />
                {errors.address && <p className="text-error-red text-[11px] font-bold mt-1.5 px-1">{errors.address}</p>}
              </div>

              <input type="text" name="apartment" placeholder="Conjunto, casa, apartamento (opcional)" value={formData.apartment} onChange={handleInputChange} className="w-full p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm mb-3 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <input type="text" name="city" placeholder="Ciudad" value={formData.city} onChange={handleInputChange} className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${errors.city ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/30 focus:border-sabana-blue'}`} />
                  {errors.city && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.city}</p>}
                </div>
                <input type="text" name="postalCode" placeholder="Código postal" value={formData.postalCode} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm focus:outline-none focus:border-sabana-blue focus:bg-white transition-all" />
                <select name="department" value={formData.department} onChange={handleInputChange} className="p-3 border border-gray-300 bg-sabana-light/30 rounded-xl text-sm text-gray-500 focus:outline-none focus:border-sabana-blue focus:bg-white transition-all">
                  <option value="">Departamento</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Bogota">Bogotá D.C.</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <button type="button" onClick={() => navigate('/cart')} className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                  Volver al carrito
                </button>
                <button type="submit" className="bg-sabana-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md">
                  Ir a detalles
                </button>
              </div>
            </form>
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

          {/* ================= STEP 3: PAGO MODIFICADO ================= */}
          {step === 'payment' && (
            <form onSubmit={handleSubmitPayment} className="animate-in fade-in duration-300">
              <div className="border border-gray-200 bg-sabana-light/20 rounded-xl p-4 mb-8 text-sm text-gray-600 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Contacto</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">{formData.emailOrPhone}</span>
                  <button type="button" onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                  <span className="text-gray-400 font-medium w-20">Enviar a</span>
                  <span className="flex-1 truncate text-sabana-blue font-medium">Universidad de La Sabana</span>
                  <button type="button" onClick={() => setStep('details')} className="text-xs text-sabana-blue font-bold underline hover:text-opacity-80">Editar</button>
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

              {/* Opción Tarjeta con Validaciones Blindadas */}
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
                    
                    {/* Número de Tarjeta */}
                    <div>
                      <input 
                        type="text" 
                        name="cardNumber" 
                        inputMode="numeric"
                        placeholder="Número de tarjeta (0000 0000 0000 0000)" 
                        value={formData.cardNumber} 
                        onChange={handleInputChange} 
                        className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                          errors.cardNumber ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/20 focus:border-sabana-blue'
                        }`} 
                      />
                      {errors.cardNumber && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.cardNumber}</p>}
                    </div>

                    {/* Nombre del Titular */}
                    <div>
                      <input 
                        type="text" 
                        name="cardName" 
                        placeholder="Nombre impreso en la tarjeta" 
                        value={formData.cardName} 
                        onChange={handleInputChange} 
                        className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                          errors.cardName ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/20 focus:border-sabana-blue'
                        }`} 
                      />
                      {errors.cardName && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.cardName}</p>}
                    </div>

                    {/* Expiración y CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input 
                          type="text" 
                          name="cardExpiry" 
                          inputMode="numeric"
                          placeholder="Expiración (MM/YY)" 
                          value={formData.cardExpiry} 
                          onChange={handleInputChange} 
                          className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                            errors.cardExpiry ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/20 focus:border-sabana-blue'
                          }`} 
                        />
                        {errors.cardExpiry && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.cardExpiry}</p>}
                      </div>
                      
                      <div>
                        <input 
                          type="password" 
                          name="cardCvv" 
                          inputMode="numeric"
                          placeholder="CVV / CVC" 
                          value={formData.cardCvv} 
                          onChange={handleInputChange} 
                          className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                            errors.cardCvv ? 'error-bg-red error-red' : 'border-gray-300 bg-sabana-light/20 focus:border-sabana-blue'
                          }`} 
                        />
                        {errors.cardCvv && <p className="text-error-red text-[11px] font-bold mt-1 px-1">{errors.cardCvv}</p>}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-12 border-t pt-4">
                <button type="button" onClick={() => setStep('shipping')} className="text-sabana-blue text-xs font-bold underline hover:text-opacity-80 transition-all">
                  Volver a envío
                </button>
                <button type="submit" className="bg-sabana-blue text-white font-bold py-3.5 px-10 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm shadow-md tracking-wide">
                  Finalizar Pago
                </button>
              </div>
            </form>
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
                ¡Gracias por tu compra! Tu pago ha sido procesado de manera segura. El tiempo estimado de entrega en el campus es de 3 días hábiles.
              </p>
              <button type="button" onClick={() => { if(clearCart) clearCart(); navigate('/'); }} className="bg-sabana-blue text-white font-bold py-3.5 px-12 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all text-sm mb-4 shadow-md">
                Volver al comercio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN LATERAL */}
      <div className="w-full md:w-5/12 bg-sabana-light/70 p-6 md:p-16 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">Resumen de tu pedido</h3>
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

          <div className="border-t border-b border-gray-300/70 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-[#1E293B]">{formatCurrency(totalProductsPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Envío</span>
              <span className="text-xs text-gray-400 font-semibold">Gratis</span>
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