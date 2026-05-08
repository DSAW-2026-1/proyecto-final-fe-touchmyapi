import React, { useState, useEffect } from 'react';
import { Search, Bell, User, ShoppingCart, Phone, Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import logoSabana from '../assets/sabanalogo.png';
import unisabanalogocomplete from '../assets/unisabanalogocomplete.png';
const PublicShowcase = () => {
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

    <div className="min-h-screen bg-sabana-light font-roboto antialiased">
      
      {/* NAVBAR */}
      <header className="bg-sabana-blue p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center ml-4">
          <div className="w-10 h-10 bg-default-white rounded-full flex items-center justify-center shadow-sm">
          <img 
            src={logoSabana} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
          </div>
        </div>
        
        <div className="flex-1 max-w-3xl mx-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="w-full py-2.5 px-12 rounded-full bg-default-white text-default-black focus:outline-none shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-2.5 text-default-gray w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-default-white mr-4">
          <div className="w-9 h-9 rounded-full bg-sabana-blue-light flex items-center justify-center overflow-hidden border border-default-white/20">
             <User className="text-sabana-blue w-6 h-6" />
          </div>
          <Bell className="w-5 h-5 cursor-pointer hover:text-sabana-blue-light transition-colors" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-sabana-blue-light transition-colors" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[480px] w-full overflow-hidden">
        <img 
          src="https://myunigate.com/wp-content/uploads/2025/06/University-of-La-Sabana.jpg" 
          alt="Campus La Sabana" 
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-sabana-light/95 p-12 flex-col items-center max-w-sm border border-defaultBorder-gray">
            <div className="mb-6 flex flex-col items-center">
               <img src={unisabanalogocomplete} alt="Universidad de La Sabana" />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <main className="container mx-auto px-6 lg:px-20 py-20">
        <h2 className="text-4xl font-roboto-slab font-bold text-default-black text-center mb-16 tracking-tight">
          Productos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-default-white rounded-2xl overflow-hidden mb-5 shadow-sm border border-defaultBorder-gray group-hover:shadow-xl group-hover:border-sabana-blue-light transition-all duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-base font-medium text-default-gray mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-sabana-blue">{formatCurrency(product.price)}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-default-gray py-10 font-roboto">No se encontraron productos.</p>
          )}
        </div>

        {/* SECCIÓN: MÁS POPULARES */}
        <section className="mt-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-roboto-slab font-bold text-default-black mb-3">Más populares</h2>
            <p className="text-default-gray font-roboto">Nuestros productos destacados del campus</p>
          </div>

          <div className="relative flex items-center group">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
              {products.slice(4, 7).map((product) => (
                <div key={product.id} className="bg-default-white p-6 rounded-2xl border border-defaultBorder-gray shadow-sm hover:shadow-2xl hover:border-sabana-blue-light transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-full h-52 bg-sabana-light/30 rounded-xl overflow-hidden mb-6">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-default-gray font-medium text-sm mb-2">{product.name}</h3>
                  <p className="text-sabana-blue font-bold text-2xl">{formatCurrency(product.price)}</p>
                </div>
              ))}
            </div>
            <button className="hidden md:block absolute -right-20 text-[#002D56] font-bold ... text-sm">
                Ver todo &rarr;
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-sabana-blue p-20 mt-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">
          <div className="flex items-center gap-10 text-default-white">
             <div className="w-24 h-32 border-2 border-default-white/10 flex items-center justify-center p-3 rounded-sm backdrop-blur-sm">
             <img 
            src={logoSabana} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
             </div>
             <div className="max-w-xs">
                <p className="text-2xl font-roboto-slab font-bold leading-tight">
                  ¿Quieres publicar tus productos en nuestra página? ¡Contáctanos!
                </p>
             </div>
          </div>

          <div className="flex gap-12 text-default-white">
            <FaInstagram className="w-10 h-10 cursor-pointer hover:text-sabana-blue-light transition-all duration-300" />
            <Phone className="w-10 h-10 cursor-pointer hover:text-sabana-blue-light transition-all duration-300" />
            <Mail className="w-10 h-10 cursor-pointer hover:text-sabana-blue-light transition-all duration-300" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShowcase;