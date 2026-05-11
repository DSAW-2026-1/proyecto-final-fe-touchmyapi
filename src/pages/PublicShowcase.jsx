import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ShoppingCart, Phone, Mail, ArrowRight, ExternalLink, X, LogOut } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logoSabana from '../assets/sabanalogo.png';
import unisabanalogowhite from '../assets/unisabanalogowhite.png';

const PublicShowcase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const CATEGORY_LABELS = {
    'ACADEMIC_SUPPLIES': 'Útiles académicos',
    'BOOKS': 'Libros',
    'ELECTRONICS': 'Electrónica',
    'CLOTHING': 'Ropa',
    'FOOD': 'Comida',
    'SERVICES': 'Servicios',
    'OTHER': 'Otros',
  };

  // 1. Fetch de productos con manejo de errores robusto para producción
  useEffect(() => {
    let isMounted = true;
    const fetchAllProducts = async () => {
      try {
        // En despliegue, esta URL sea una variable de entorno
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/products`);
        
        if (!response.ok) throw new Error('Error en la red');
        const dbProducts = await response.json();
        const validatedDbProducts = Array.isArray(dbProducts) ? dbProducts : [];

        const mockProducts = [
          { 
            id: 'm1', 
            title: "iPad usado", 
            price: 1000000, 
            stock: 1,
            category: "ELECTRONICS", 
            condition: "USED",
            imageUrl: "https://photos.enjoei.com.br/ipad-pro-11-polegadas-4a-geracao-chip-m2-128-gb-wi-fi-cellular-cinza-espacial-115940100/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy81NTA4NDgzL2I5MjgwNmI1NWQ5NGU1NmNjYmFhOTM2MDY2ZjE0OWQ5LmpwZw"
          },
          { 
            id: 'm2', 
            title: "Cargador tipo C", 
            price: 36000, 
            stock: 5,
            category: "ELECTRONICS", 
            condition: "NEW",
            imageUrl: "https://m.media-amazon.com/images/I/61cws8I2EzL._AC_.jpg" 
          }
        ];

        if (isMounted) {
          // Usamos el array validado para que no se estalle el .map()
          setProducts([...validatedDbProducts, ...mockProducts]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        if (isMounted) {
          // Si falla el back, al menos mostramos los mocks para que no se vea vacío
          setProducts([
            { id: 'm1', title: "iPad usado (Modo Offline)", price: 1000000, stock: 1, category: "ELECTRONICS", condition: "USED" },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllProducts();
    return () => { isMounted = false; };
  }, []);

  // 2. Optimizamos filtrado y cálculos con useMemo para evitar re-renders costosos
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedPopular = useMemo(() => {
    if (products.length === 0) return [];
    const totalStock = products.reduce((acc, prod) => acc + (prod.stock || 0), 0);
    const averageStock = totalStock / products.length;
    return products
      .filter(product => (product.stock || 0) > averageStock)
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 4);
  }, [products]);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Componente Modal Extraído para limpieza
  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-sabana-blue/40 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full text-sabana-blue hover:bg-sabana-blue hover:text-white transition-all shadow-md">
            <X size={20} />
          </button>
          <div className="md:w-1/2 h-64 md:h-auto bg-sabana-light">
            <img 
              src={product.imageUrl || logoSabana} 
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = logoSabana; }}
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col">
            <div className="flex gap-2 mb-3">
              <span className="text-[10px] font-bold bg-sabana-softGold/10 text-sabana-blue-light px-2 py-1 rounded-md uppercase">
                {CATEGORY_LABELS[product.category] || product.category || 'Otros'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                product.condition === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {product.condition === 'NEW' ? 'Nuevo' : 'Usado'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-sabana-blue mb-3">{product.title}</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {product.description || "Este producto es ofrecido por un miembro de la comunidad Sabana."}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Precio</p>
                <p className="text-2xl font-black text-sabana-blue">{formatCurrency(product.price)}</p>
              </div>
              <button className="bg-sabana-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-sabana-blue-hover transition-all shadow-md active:scale-95">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans antialiased">
      {/* NAVBAR */}
      <header className="bg-sabana-blue px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <img src={logoSabana} alt="Logo Sabana" className="h-8 w-auto object-contain" />
          </div>
          <span className="hidden lg:block text-white font-bold tracking-tight">Marketplace Unisabana</span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?" 
              className="w-full py-2.5 px-12 rounded-2xl bg-white/10 text-white placeholder:text-white/60 focus:bg-white focus:text-sabana-blue focus:outline-none transition-all shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 text-white/50 group-focus-within:text-sabana-blue w-5 h-5 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-5 text-white">
          <div className="relative cursor-pointer hover:text-sabana-softGold transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-sabana-blue"></span>
          </div>

          <div className="relative cursor-pointer group">
            <ShoppingCart size={22} className="group-hover:text-sabana-softGold transition-colors" />
            <span className="absolute -top-2 -right-2 bg-sabana-softGold text-sabana-blue text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-sabana-blue">2</span>
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
           <h1 className="text-4xl md:text-5xl font-bold text-white max-w-xl leading-tight">
             El mercado oficial de la comunidad <span className="text-sabana-softGold">Sabana</span>
           </h1>
           <p className="text-white/80 mt-4 text-lg max-w-md">Compra y vende artículos de forma segura dentro de tu campus universitario.</p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16">
        {/* SECCIÓN MÁS POPULARES (Primero para impacto visual) */}
        {sortedPopular.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-sabana-blue tracking-tight">Más populares en el campus</h2>
                <p className="text-gray-500 mt-1 text-sm">Los artículos con mayor disponibilidad hoy.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedPopular.map((product) => (
                <div 
                  key={`popular-${product.id}`} 
                  onClick={() => setSelectedProduct(product)} 
                  className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-sabana-softGold/20 cursor-pointer"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-sabana-light">
                    <img
                      src={product.imageUrl || logoSabana}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = logoSabana; }}
                    />
                    <div className="absolute top-3 right-3 bg-sabana-softGold text-sabana-blue text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                      TENDENCIA: {product.stock} DISPONIBLES
                    </div>
                  </div>
                  <div className="px-2">
                    <span className="text-[10px] font-bold text-sabana-blue-light uppercase tracking-widest">
                      {CATEGORY_LABELS[product.category] || product.category || 'Otros'}
                    </span>
                    <h3 className="text-lg font-bold text-sabana-blue mt-1 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-bold text-sabana-blue">{formatCurrency(product.price)}</p>
                      <div className="bg-sabana-light p-2 rounded-xl text-sabana-blue hover:bg-sabana-blue hover:text-white transition-colors">
                        <ShoppingCart size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TODOS LOS PRODUCTOS */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-sabana-blue tracking-tight">Explorar Productos</h2>
          <div className="h-1 flex-1 mx-8 bg-sabana-blue/5 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
            ))
          ) : filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProduct(product)} 
              className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-transparent hover:border-sabana-softGold/20"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-sabana-light">
                <img
                  src={product.imageUrl || logoSabana}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = logoSabana; }}
                />
              </div>
              <div className="px-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-sabana-blue-light uppercase tracking-widest">
                    {CATEGORY_LABELS[product.category] || product.category || 'Otros'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase transition-all ${
                    product.stock === 1 ? 'text-red-500 animate-pulse bg-red-50 px-2 py-0.5 rounded-md' : 'text-gray-400'
                  }`}>
                    {product.stock === 1 ? '¡Última unidad!' : `${product.stock || 0} disp.`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-sabana-blue mt-1 line-clamp-1">{product.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-sabana-blue">{formatCurrency(product.price)}</p>
                  <div className="bg-sabana-light p-2 rounded-xl text-sabana-blue hover:bg-sabana-blue hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-sabana-blue text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
            <div className="col-span-1">
              <img src={logoSabana} alt="Logo" className="h-12 bg-white p-2 rounded-xl mb-6" />
              <p className="text-white/60 text-sm leading-relaxed">
                El punto de encuentro oficial para el comercio seguro dentro del campus de la Universidad de La Sabana.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Marketplace</h4>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="hover:text-sabana-softGold cursor-pointer transition-colors">Todos los productos</li>
                <li className="hover:text-sabana-softGold cursor-pointer transition-colors">Publicar artículo</li>
                <li className="hover:text-sabana-softGold cursor-pointer transition-colors">Términos y condiciones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Universidad</h4>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-2 hover:text-sabana-softGold cursor-pointer transition-colors">
                   Campus Chía <ExternalLink size={14} />
                </li>
                <li className="hover:text-sabana-softGold cursor-pointer transition-colors">Directorio Estudiantil</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sabana-softGold uppercase tracking-widest text-xs">Contacto Directo</h4>
              <div className="flex gap-4 mb-6">
                {[FaInstagram, Phone, Mail].map((Icon, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabana-softGold hover:text-sabana-blue transition-all cursor-pointer">
                    <Icon size={20} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40 font-bold">© 2026 Universidad de La Sabana</p>
            </div>
          </div>
          <div className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
            Personas que inspiran personas - Marketplace
          </div>
        </div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default PublicShowcase;