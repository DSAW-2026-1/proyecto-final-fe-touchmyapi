import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ShoppingCart, Phone, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logoSabana from '../assets/sabanalogo.png';
import unisabanalogowhite from '../assets/unisabanalogowhite.png';

const PublicShowcase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const mockProducts = [
      { id: 1, name: "iPad usado", price: 1000000, category: "Electrónica", image: "https://photos.enjoei.com.br/ipad-pro-11-polegadas-4a-geracao-chip-m2-128-gb-wi-fi-cellular-cinza-espacial-115940100/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy81NTA4NDgzL2I5MjgwNmI1NWQ5NGU1NmNjYmFhOTM2MDY2ZjE0OWQ5LmpwZw"},
      { id: 2, name: "Cargador tipo C", price: 36000, category: "Accesorios", image: "https://m.media-amazon.com/images/I/61cws8I2EzL._AC_.jpg" },
      { id: 3, name: "AirPods", price: 800000, category: "Audio", image: "https://i.ebayimg.com/images/g/vgAAAOSwcF1lg3Vv/s-l1600.webp" },
      { id: 4, name: "Libro - Cálculo I", price: 57000, category: "Libros", image: "https://m.media-amazon.com/images/I/71HU6XkiZ5L._SL1024_.jpg" },
      { id: 5, name: "Calculadora", price: 45000, category: "Estudio", image: "https://i.ebayimg.com/images/g/SxYAAOSwdgtjoT19/s-l1600.webp" },
      { id: 6, name: "Lapiceros", price: 18000, category: "Papelería", image: "https://plazavea.vteximg.com.br/arquivos/ids/292755-1000-1000/20169705.jpg?v=637166952632400000" },
      { id: 7, name: "Gorra U Sabana", price: 40000, category: "Merchandising", image: "https://i.ebayimg.com/images/g/7DoAAOSwm0Zm4D30/s-l1600.webp" },
    ];
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans antialiased">
      
      {/* NAVBAR */}

      <header className="bg-sabana-blue px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-default-white p-1.5 rounded-xl shadow-sm">
            <img src={logoSabana} alt="Logo Sabana" className="h-8 w-auto object-contain" />
          </div>
          <span className="hidden lg:block text-default-white font-bold tracking-tight">Marketplace Unisabana</span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?" 
              className="w-full py-2.5 px-12 rounded-2xl bg-default-white/10 text-default-white placeholder:text-default-white/60 focus:bg-default-white focus:text-sabana-blue focus:outline-none transition-all shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 text-default-white/50 group-focus-within:text-sabana-blue w-5 h-5 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-5 text-default-white">
          {/* CAMPANA DE NOTIFICACIONES REINTEGRADA */}
          <div className="relative cursor-pointer hover:text-sabana-softGold transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-error-red w-2.5 h-2.5 rounded-full border-2 border-sabana-blue"></span>
          </div>

          <div className="relative cursor-pointer group">
            <ShoppingCart size={22} className="group-hover:text-sabana-softGold transition-colors" />
            <span className="absolute -top-2 -right-2 bg-sabana-softGold text-sabana-blue text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-sabana-blue">2</span>
          </div>

          {/* CONTENEDOR DE USUARIO Y LOGOUT */}
          <div className="flex items-center gap-4 border-l border-default-white/20 pl-5">
            {/* Botón Mi Cuenta / Inventario */}
            <div 
              onClick={() => {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                navigate(isLoggedIn ? '/inventory' : '/login');
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-sabana-softGold transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-default-white/10 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">
                {localStorage.getItem('isLoggedIn') === 'true' ? 'Mi Inventario' : 'Mi Cuenta'}
              </span>
            </div>

            {/* BOTÓN CERRAR SESIÓN (Solo aparece si está logueado) */}
            {localStorage.getItem('isLoggedIn') === 'true' && (
              <button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  // Opcional: limpiar otros datos como el nombre del usuario si los guardas
                  window.location.reload(); // Recargamos para que el Navbar se actualice
                }}
                className="ml-2 p-2 rounded-lg bg-error-red/10 hover:bg-error-red text-error-red hover:text-default-white transition-all duration-300"
                title="Cerrar Sesión"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
          
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://myunigate.com/wp-content/uploads/2025/06/University-of-La-Sabana.jpg" 
          alt="Campus La Sabana" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sabana-blue/90 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-10 flex flex-col items-start">
           <img src={unisabanalogowhite} alt="Universidad de La Sabana" className="h-20 mb-6 drop-shadow-lg" />
           <h1 className="text-4xl md:text-5xl font-bold text-default-white max-w-xl leading-tight">
             El mercado oficial de la comunidad <span className="text-sabana-softGold">Sabana</span>
           </h1>
           <p className="text-default-white/80 mt-4 text-lg max-w-md">Compra y vende artículos de forma segura dentro de tu campus universitario.</p>
        </div>
      </section>

      {/* PRODUCTOS */}
      <main className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-sabana-blue tracking-tight">Explorar Productos</h2>
          <div className="h-1 flex-1 mx-8 bg-sabana-blue/5 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-default-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-sabana-softGold/20">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-sabana-light">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="px-2 pb-2">
                <span className="text-[10px] font-bold text-sabana-softGold uppercase tracking-widest">{product.category}</span>
                <h3 className="text-lg font-bold text-sabana-blue mt-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-sabana-blue">{formatCurrency(product.price)}</p>
                  <button className="bg-sabana-light p-2 rounded-xl text-sabana-blue hover:bg-sabana-blue hover:text-default-white transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MÁS POPULARES */}
        <section className="mt-24 bg-default-white rounded-[40px] p-10 md:p-16 shadow-xl border border-sabana-blue/5">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-sabana-blue tracking-tight">Más Populares en el Campus</h2>
              <p className="text-default-gray mt-2 font-medium">Los favoritos de los estudiantes esta semana.</p>
            </div>
            <button className="flex items-center gap-2 text-sabana-blue font-bold hover:gap-4 transition-all">
              Ver todo el catálogo <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(4, 7).map((product) => (
              <div key={product.id} className="flex gap-4 items-center p-4 rounded-2xl hover:bg-sabana-light transition-colors cursor-pointer">
                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover shadow-md" />
                <div>
                  <h3 className="font-bold text-sabana-blue">{product.name}</h3>
                  <p className="text-sabana-blue/60 text-sm font-medium">{product.category}</p>
                  <p className="text-lg font-bold text-sabana-blue mt-1">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-sabana-blue text-default-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-default-white/10 pb-16">
            
            <div className="col-span-1 md:col-span-1">
              <img src={logoSabana} alt="Logo" className="h-12 bg-default-white p-2 rounded-xl mb-6" />
              <p className="text-default-white/60 text-sm leading-relaxed font-medium">
                El punto de encuentro oficial para el comercio seguro dentro del campus de la Universidad de La Sabana.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Marketplace</h4>
              <ul className="space-y-4 text-sm text-default-white/80">
                <li className="hover:text-default-white cursor-pointer transition-colors font-medium">Todos los productos</li>
                <li className="hover:text-default-white cursor-pointer transition-colors font-medium">Publicar artículo</li>
                <li className="hover:text-default-white cursor-pointer transition-colors font-medium">Términos y condiciones</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Universidad</h4>
              <ul className="space-y-4 text-sm text-default-white/80">
                <li className="flex items-center gap-2 hover:text-default-white cursor-pointer transition-colors font-medium">
                   Campus Chía <ExternalLink size={14} />
                </li>
                <li className="hover:text-default-white cursor-pointer transition-colors font-medium">Directorio Estudiantil</li>
                <li className="hover:text-default-white cursor-pointer transition-colors font-medium">Soporte Técnico</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Contacto Directo</h4>
              <div className="flex gap-4 mb-6">
                {[FaInstagram, Phone, Mail].map((Icon, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-xl bg-default-white/5 border border-default-white/10 flex items-center justify-center hover:bg-sabana-softGold hover:text-sabana-blue transition-all cursor-pointer">
                    <Icon size={20} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-default-white/40 font-bold">© 2026 Universidad de La Sabana</p>
            </div>
          </div>
          
          <div className="text-center text-[10px] text-default-white/20 font-bold uppercase tracking-[0.3em]">
            Personas que inspiran personas - Marketplace
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShowcase;