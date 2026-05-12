import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ShoppingCart, Phone, Mail, LogOut } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logoSabana from '../assets/sabanalogo.png';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  
  // SE INCLUYE LA NUEVA FUNCIÓN updateQuantity DEL CONTEXTO
  const { cartItems, updateQuantity, getCartCount, getCartTotalPrice, removeFromCart } = useCart();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
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

  // CORREGIDO: Ahora disminuye la cantidad de 1 en 1 usando updateQuantity de forma segura
  const handleDecreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity - 1, item.stock);
  };

  // NUEVA FUNCIÓN CONTROLADA: Incrementa validando el límite del stock del producto
  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1, item.stock);
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans antialiased flex flex-col justify-between">
      
      {/* NAVBAR */}
      <header className="bg-sabana-blue px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-sabana-light p-1.5 rounded-xl shadow-sm">
            <img src={logoSabana} alt="Logo Sabana" className="h-8 w-auto object-contain" />
          </div>
          <span className="hidden lg:block text-white font-bold tracking-tight">Marketplace Unisabana</span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?" 
              className="w-full py-2.5 px-12 rounded-2xl bg-white/10 text-white placeholder:text-white/60 focus:bg-sabana-light focus:text-sabana-blue focus:outline-none transition-all shadow-inner text-sm"
              disabled
            />
            <Search className="absolute left-4 top-2.5 text-white/50 w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-5 text-white">
          <div className="relative cursor-pointer hover:text-sabana-softGold transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-sabana-blue"></span>
          </div>

          <div 
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer group"
          >
            <ShoppingCart size={22} className="text-sabana-softGold" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-sabana-softGold text-sabana-blue text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-sabana-blue">
                {getCartCount()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 border-l border-white/20 pl-5">
            <div 
              onClick={() => navigate(isLoggedIn ? '/inventory' : '/login')}
              className="flex items-center gap-2 cursor-pointer hover:text-sabana-softGold transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">
                {isLoggedIn ? 'Mi Inventario' : 'Mi Cuenta'}
              </span>
            </div>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CUERPO CENTRAL */}
      <main className="flex-1 container mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-center text-2xl font-semibold text-[#1E293B] mb-2 tracking-tight">
          Tu carrito de compras
        </h1>
        
        <div className="text-center mb-10">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs text-sabana-blue underline hover:text-opacity-80 font-medium transition-colors"
          >
            Volver al comercio
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-sabana-light rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg font-medium mb-4">Tu carrito está vacío actualmente.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-sabana-blue text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div>
            {/* TABLA DE PRODUCTOS */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    <th className="pb-4 w-[50%]">Producto</th>
                    <th className="pb-4 text-center">Precio</th>
                    <th className="pb-4 text-center">Cantidad</th>
                    <th className="pb-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="align-middle">
                      {/* Producto */}
                      <td className="py-6 flex items-center gap-5">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-sabana-light border border-gray-100 p-2 flex items-center justify-center shadow-sm">
                          <img 
                            src={item.imageUrl || logoSabana} 
                            alt={item.title} 
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => { e.target.src = logoSabana; }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-[#1E293B] text-base">{item.title}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-500 hover:text-red-700 underline text-left font-medium transition-colors w-fit"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>

                      {/* Precio */}
                      <td className="py-6 text-center font-semibold text-[#1E293B] text-sm">
                        {formatCurrency(item.price)}
                      </td>

                      {/* Selector de cantidad [+ 1 -] Modificado */}
                      <td className="py-6 text-center">
                        <div className="inline-flex items-center justify-between border border-gray-300 rounded-md bg-sabana-light px-2 py-1 text-sm shadow-sm gap-3 select-none">
                          <button 
                            onClick={() => handleDecreaseQuantity(item)}
                            className="text-gray-400 hover:text-gray-600 font-bold px-1 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-semibold text-[#1E293B] min-w-[12px]">
                            {item.quantity || 1}
                          </span>
                          <button 
                            onClick={() => handleIncreaseQuantity(item)}
                            className="text-gray-400 hover:text-gray-600 font-bold px-1 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-6 text-right font-bold text-[#1E293B] text-sm">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECCIÓN TOTALES Y CHECKOUT */}
            <div className="mt-8 flex flex-col items-end gap-2 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-12 text-sm">
                <span className="font-bold text-[#1E293B] text-base">Subtotal</span>
                <span className="font-bold text-[#1E293B] text-base">{formatCurrency(getCartTotalPrice())}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                El costo del envío se calcula en la pantalla de envío
              </p>
              <button 
                onClick={() => navigate('/checkout')}
                className="mt-4 bg-[#002D72] text-white px-10 py-3 rounded-lg font-bold text-sm hover:bg-opacity-90 active:scale-95 transition-all shadow-md tracking-wide"
              >
                Check-out
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-sabana-blue text-white pt-12 pb-8 w-full mt-auto">
        <div className="container mx-auto max-w-5xl px-6 flex flex-col items-center">
          <div className="w-full h-[1px] bg-white/20 mb-10"></div>
          <div className="text-center max-w-xl mx-auto mb-8 flex flex-col items-center">
            <img src={logoSabana} alt="Escudo Unisabana" className="h-20 w-auto object-contain bg-sabana-light p-3 rounded-2xl mb-5 shadow-md" />
            <h2 className="text-xl font-semibold mb-6 tracking-tight leading-snug">
              ¿Quieres publicar tus productos en nuestra página?<br />¡Contáctanos!
            </h2>
            <div className="flex justify-center items-center gap-8">
              <a href="#" className="text-white hover:text-sabana-softGold transition-colors" title="Instagram">
                <FaInstagram size={28} />
              </a>
              <a href="#" className="text-white hover:text-sabana-softGold transition-colors" title="Teléfono">
                <Phone size={28} />
              </a>
              <a href="#" className="text-white hover:text-sabana-softGold transition-colors" title="Correo Electrónico">
                <Mail size={28} />
              </a>
            </div>
          </div>
          <div className="w-full text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.25em] border-t border-white/10 pt-6 mt-4">
            Personas que inspiran personas - Marketplace Unisabana
          </div>
        </div>
      </footer>

    </div>
  );
};

export default CartPage;