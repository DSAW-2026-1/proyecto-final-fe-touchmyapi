import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Phone, Mail, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png'; 
import downloadImg from '../assets/descargar.png';
import completeLogo from '../assets/unisabanalogocomplete.png';

const PersonalInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("No pude conectar con el server:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este producto?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        }
      } catch (error) {
        alert("Error al intentar borrar.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans flex flex-col antialiased">
      {/* NAVBAR */}
      <header className="bg-sabana-blue sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-default-white p-1.5 rounded-xl shadow-inner">
            <img src={smallLogo} alt="Logo Sabana" className="h-8 w-auto object-contain" />
          </div>
          <span className="hidden md:block text-default-white font-bold tracking-tight text-lg">Marketplace Sabana</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Buscar en tu inventario..." 
              className="w-full py-2.5 px-11 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white focus:text-sabana-blue focus:outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-white/60 group-focus-within:text-sabana-blue w-5 h-5 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell className="text-default-white w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-sabana-softGold w-3 h-3 rounded-full border-2 border-sabana-blue"></span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sabana-softGold/20 border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
            <User className="text-default-white w-6 h-6" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        {/* Header de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sabana-blue font-semibold text-sm mb-2 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft size={16} /> Volver al inicio
            </button>
            <h1 className="text-4xl font-extrabold text-sabana-blue tracking-tight">Tus productos</h1>
            <p className="text-default-gray mt-1">Gestiona los artículos que tienes publicados actualmente.</p>
          </div>
          
          <button 
            onClick={() => navigate('/create-product')} 
            className="flex items-center justify-center gap-2 bg-sabana-blue text-default-white px-8 py-3.5 rounded-2xl font-bold hover:bg-sabana-blue-hover transition-all shadow-[0_10px_20px_rgba(0,29,74,0.2)] active:scale-95"
          >
            <Plus size={20} /> Añadir productos
          </button>
        </div>

        {/* LISTADO ESTILO CARD */}
        <div className="space-y-4">
          {/* Cabecera Oculta en Mobile */}
          <div className="hidden md:grid grid-cols-12 px-8 py-3 text-sabana-blue/60 font-bold text-xs uppercase tracking-widest">
            <div className="col-span-6">Detalles del Producto</div>
            <div className="col-span-2 text-center">Precio Unitario</div>
            <div className="col-span-2 text-center">En Stock</div>
            <div className="col-span-2 text-right">Valor Total</div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-default-gray font-medium">Cargando tus tesoros...</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-dashed border-defaultBorder-gray">
              <p className="text-default-gray text-lg">Aún no tienes productos publicados.</p>
            </div>
          ) : (
            products.map((product) => (
              <div 
                key={product.id} 
                className="group grid grid-cols-1 md:grid-cols-12 items-center bg-default-white p-4 md:px-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-sabana-softGold/30"
              >
                {/* Info Principal */}
                <div className="col-span-6 flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={product.imageUrl || downloadImg}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-2xl shadow-inner border border-defaultBorder-gray"
                    />
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="absolute -top-2 -right-2 bg-error-bg-red text-error-red p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-red hover:text-white"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sabana-blue leading-tight">{product.title}</h3>
                    <span className="text-[10px] font-bold bg-sabana-light px-2 py-0.5 rounded text-sabana-blue uppercase tracking-wider">
                      {product.category || 'Otros'}
                    </span>
                  </div>
                </div>

                {/* Precio */}
                <div className="col-span-2 text-center mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">PRECIO</span>
                  <span className="text-default-gray font-medium">${product.price.toLocaleString('es-CO')}</span>
                </div>

                {/* Stock */}
                <div className="col-span-2 flex flex-col items-center mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">STOCK</span>
                  <div className="bg-sabana-light text-sabana-blue font-bold px-4 py-1 rounded-xl border border-sabana-blue/10">
                    {product.stock || 1}
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right mt-4 md:mt-0">
                  <span className="md:hidden text-[10px] block font-bold text-default-gray">TOTAL</span>
                  <span className="text-xl font-black text-sabana-blue">
                    ${(product.price * (product.stock || 1)).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FOOTER PREMIUM */}
      <footer className="bg-sabana-blue text-default-white mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={completeLogo} alt="Logo Sabana" className="h-16 w-auto object-contain" />
              <div className="h-12 w-[1px] bg-white/20 hidden md:block"></div>
              <p className="max-w-xs text-center md:text-left text-sm opacity-80 leading-relaxed">
                ¿Deseas destacar tus productos? Contáctanos y te ayudamos a llegar a más estudiantes.
              </p>
            </div>

            <div className="flex gap-4">
              {[ {Icon: FaInstagram, link: '#'}, {Icon: Phone, link: '#'}, {Icon: Mail, link: '#'} ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.link} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-sabana-softGold hover:text-sabana-blue hover:-translate-y-1 transition-all"
                >
                  <item.Icon size={24} />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center text-xs opacity-40 font-medium tracking-widest uppercase">
            © 2026 Universidad de La Sabana - Marketplace Estudiantil
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PersonalInventory;