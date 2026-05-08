import React, { useState } from 'react';
import { Search, Bell, User, Phone, Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png'; 
import descargarImg from '../assets/descargar.png';
const PersonalInventory = () => {
  // Estado inicial simulando la data que vendría de tu "DataStore" en memoria
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Cargador tipo C",
      price: 36000,
      stock: 2,
      imageUrl: descargarImg,
    }
  ]);

  const handleDelete = (id) => {
    // Lógica para el endpoint DELETE /api/v1/products/{id}
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="min-h-screen bg-sabana-light font-sans flex flex-col">
      {/* NAVBAR */}
      <header className="bg-sabana-blue p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          {/* Logo Sabana Placeholder */}
          <div className="w-10 h-10 bg-default-white rounded-full flex items-center justify-center p-1">
          <img 
            src={smallLogo} 
            alt="Logo Sabana" 
            className="h-12 w-auto object-contain" 
          />
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full py-2 px-10 rounded-full bg-sabana-light focus:outline-none focus:ring-2 focus:ring-sabana-softGold"
            />
            <Search className="absolute left-3 top-2.5 text-default-gray w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-default-white">
          <div className="w-10 h-10 rounded-full bg-defaultBorder-gray border-2 border-default-white overflow-hidden">
             <User className="text-default-gray w-full h-full p-1" />
          </div>
          <Bell className="w-6 h-6 cursor-pointer" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-default-black mb-2">Tus productos</h1>
          <a href="/" className="text-sabana-blue-light underline hover:text-sabana-blue-hover">Volver al inicio</a>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-4 border-b border-defaultBorder-gray pb-4 mb-6 text-default-gray font-semibold text-sm">
          <div>Producto</div>
          <div className="text-center">Precio por unidad</div>
          <div className="text-center">Stock</div>
          <div className="text-right">Total</div>
        </div>

        {/* PRODUCT LIST */}
        <div className="space-y-8">
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-4 items-center bg-transparent">
              <div className="flex items-center gap-4">
              <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md shadow-sm border border-defaultBorder-gray"
                />
                <div>
                  <h3 className="text-xl font-bold text-default-black">{product.name}</h3>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-sabana-blue-light underline text-sm hover:text-error-red transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="text-center text-lg text-default-gray">
                ${product.price.toLocaleString('es-CO')}
              </div>

              <div className="flex justify-center">
                <div className="border border-sabana-blue-light bg-default-white px-6 py-1 rounded text-lg">
                  {product.stock}
                </div>
              </div>

              <div className="text-right text-lg font-semibold text-default-black">
                ${(product.price * product.stock).toLocaleString('es-CO')}
              </div>
            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end mt-12 items-center gap-4">
         
          <button className="bg-sabana-blue text-default-white px-10 py-3 rounded-md font-bold hover:bg-sabana-blue-hover transition-all shadow-lg">
            Añadir productos
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-sabana-blue text-default-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-24 border-2 border-default-white/20 flex items-center justify-center p-2">
                <img
                  src={smallLogo}
                  alt="Logo Sabana"
                  className="h-16 w-auto object-contain"
                />
             </div>
             <div className="max-w-xs">
                <p className="text-lg font-medium leading-tight">
                  ¿Quieres publicar tus productos en nuestra página? ¡Contáctanos!
                </p>
             </div>
          </div>

          <div className="flex gap-8">
            <FaInstagram className="w-10 h-10 cursor-pointer hover:text-sabana-softGold transition-colors" />
            <Phone className="w-10 h-10 cursor-pointer hover:text-sabana-softGold transition-colors" />
            <Mail className="w-10 h-10 cursor-pointer hover:text-sabana-softGold transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PersonalInventory;