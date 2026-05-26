import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ShoppingCart, Phone, Mail, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logoSabana from '../assets/sabanalogo.png';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  
  // Agregamos clearCart desde tu contexto para la nueva funcionalidad
  const { cartItems = [], updateQuantity, getCartCount, getCartTotalPrice, removeFromCart, clearCart } = useCart();

  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString('es-CO')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleDecreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity - 1, item.stock);
  };

  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1, item.stock);
  };

  return (
    <div className="min-h-screen bg-sabana-light font-roboto flex flex-col">
      
      {/* HEADER INSTITUCIONAL ESTILO CHECKOUT */}
      <header className="bg-sabana-blue text-white py-4 px-6 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/publicshowcase')}>
          <img src={logoSabana} alt="Logo Sabana" className="h-10 w-auto bg-white p-1 rounded-lg" />
          <h1 className="text-xl font-roboto-slab font-black uppercase tracking-wider">Marketplace Sabana</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/publicshowcase')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sabana-blue-light bg-white/5 border border-white/20 hover:bg-white/10 hover:text-white px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={14} /> Seguir Comprando
          </button>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-roboto-slab font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <ShoppingCart className="text-sabana-blue" size={26} /> Tu Carrito de Compras
            </h2>
            <p className="text-xs text-gray-500 font-bold mt-1">
              Tienes {getCartCount()} {getCartCount() === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
            </p>
          </div>

          {/* BOTÓN VACIAR CARRITO (Añadido por requerimiento) */}
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if(window.confirm('¿Estás seguro de que quieres vaciar por completo tu carrito?')) {
                  clearCart();
                }
              }}
              className="flex items-center justify-center gap-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 active:scale-[0.98] px-4 py-2.5 rounded-2xl transition-all shadow-sm shrink-0 uppercase tracking-widest"
            >
              <Trash2 size={15} /> Vaciar Carrito
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ESTADO CARRITO VACÍO RE-ESTILIZADO */
          <div className="bg-white p-12 rounded-3xl shadow-sabana-card text-center max-w-lg mx-auto space-y-5 animate-scaleIn">
            <div className="w-16 h-16 bg-sabana-light text-sabana-blue rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-roboto-slab font-black text-slate-800 uppercase tracking-wider">Tu carrito está vacío</h3>
              <p className="text-xs text-gray-500 font-medium">Parece que aún no has agregado ningún producto del catálogo de la U.</p>
            </div>
            <button 
              onClick={() => navigate('/publicshowcase')}
              className="bg-sabana-blue text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover transition-all shadow-md inline-flex items-center gap-2"
            >
              Explorar Catálogo <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* GRILLA CON DOS COLUMNAS AL ESTILO CHECKOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: LISTADO DE PRODUCTOS (8 Columnas) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 rounded-3xl shadow-sabana-card border border-gray-100/40 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-sabana-blue-light/30 animate-fadeIn"
                >
                  {/* Imagen Estilizada */}
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-gray-200/50 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    <img 
                      src={item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : logoSabana} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Detalles Informativos */}
                  <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
                    <span className="text-[10px] bg-sabana-light text-sabana-blue px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider">
                      {item.category || 'Producto'}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1">{item.title}</h3>
                    <p className="text-xs font-bold text-sabana-blue">{formatCurrency(item.price)} <span className="text-gray-400 font-medium">c/u</span></p>
                  </div>

                  {/* Controles de Cantidad y Eliminación */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Botonera +/- */}
                    <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-gray-200/40 shadow-sm">
                      <button 
                        onClick={() => handleDecreaseQuantity(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncreaseQuantity(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal del Item */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-[9px]">Subtotal</p>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                    </div>

                    {/* Tacho de Basura */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMNA DERECHA: RESUMEN FINANCIERO (4 Columnas) */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl shadow-sabana-card space-y-6 sticky top-24 border border-gray-100/50">
                <h3 className="text-base font-roboto-slab font-black text-sabana-blue uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                  Resumen de la Orden
                </h3>

                <div className="space-y-3.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-black uppercase tracking-wider">Total Artículos</span>
                    <span className="font-extrabold text-slate-800">{getCartCount()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-black uppercase tracking-wider">Subtotal Compra</span>
                    <span className="font-extrabold text-slate-800">{formatCurrency(getCartTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-400 font-black uppercase tracking-wider">Entrega en Campus</span>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Gratis</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black text-sabana-blue uppercase tracking-widest">Total Estimado</span>
                    <span className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(getCartTotalPrice())}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold leading-tight">
                    * El pago definitivo se coordinará contra entrega en efectivo o transferencia.
                  </p>
                </div>

                {/* BOTÓN PRINCIPAL DE CHECKOUT */}
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-sabana-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sabana-blue-hover active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Proceder al Pago <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-sabana-blue text-white pt-12 pb-6 px-6 mt-12 border-t-4 border-sabana-blue-hover">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-8 flex flex-col items-center">
            <img src={logoSabana} alt="Escudo Unisabana" className="h-16 w-auto object-contain bg-white p-2 rounded-2xl mb-4 shadow-md" />
            <h2 className="text-base font-roboto-slab font-black uppercase tracking-wide mb-2 text-sabana-blue-light">
              Marketplace Unisabana Estudiantil
            </h2>
            <p className="text-xs text-white/70 font-medium">
              ¿Quieres publicar tus productos o tienes sugerencias del sistema? ¡Escríbenos por nuestros canales oficiales!
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-6 mb-8">
            {[
              { icon: FaInstagram, title: "Instagram" },
              { icon: Phone, title: "Teléfono" },
              { icon: Mail, title: "Correo Electrónico" }
            ].map((social, idx) => {
              const IconComp = social.icon;
              return (
                <div key={idx} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-sabana-blue transition-all cursor-pointer shadow-sm" title={social.title}>
                  <IconComp size={20} />
                </div>
              );
            })}
          </div>

          <div className="w-full text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.25em] border-t border-white/5 pt-6">
            Personas que inspiran personas — Universidad de La Sabana
          </div>
        </div>
      </footer>

    </div>
  );
};

export default CartPage;