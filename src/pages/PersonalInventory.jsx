import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Phone, Mail, Trash2, Plus, ArrowLeft, Pencil } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import smallLogo from '../assets/sabanalogo.png'; 
import completeLogo from '../assets/unisabanalogocomplete.png';



const PersonalInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const fetchProducts = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/login'); 
        return;
      }

      // Asegúrate de que el endpoint coincida con tu @GetMapping del backend
      
      const response = await fetch(`${apiUrl}/api/v1/products/owner/${userEmail}`);
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
    if (window.confirm("¿Seguro que quieres borrar este producto? Esta acción no se puede deshacer.")) {
      try {
        
        const response = await fetch(`${apiUrl}/api/v1/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        } else {
          alert("El servidor no permitió borrar el producto.");
        }
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("Error al intentar conectar con el servidor.");
      }
    }
  };

  const CATEGORIES = [
    { value: 'ACADEMIC_SUPPLIES', label: 'Útiles académicos' },
    { value: 'BOOKS', label: 'Libros' },
    { value: 'ELECTRONICS', label: 'Electrónica' },
    { value: 'CLOTHING', label: 'Ropa' },
    { value: 'FOOD', label: 'Comida' },
    { value: 'SERVICES', label: 'Servicios' },
    { value: 'OTHER', label: 'Otros' },
  ];

  // SUB-COMPONENTE: MODAL DE EDICIÓN
  const EditModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [hostMessage, setHostMessage] = useState('');

    if (!product) return null;

    const validateForm = () => {
      const newErrors = {};
      if (!formData.title?.trim()) newErrors.title = 'El nombre es obligatorio';
      if (!formData.category) newErrors.category = 'Selecciona una categoría';
      
      const numericPrice = Number(formData.price);
      if (isNaN(numericPrice) || numericPrice <= 0) newErrors.price = 'Precio inválido';

      const numericStock = Number(formData.stock);
      if (isNaN(numericStock) || numericStock < 1) newErrors.stock = 'Mínimo 1 unidad';

      if (!formData.description?.trim() || formData.description.length < 3) {
        newErrors.description = 'Descripción demasiado corta';
      }

      setFieldErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSaving(true);
      try {
        
        const response = await fetch(`${apiUrl}/api/v1/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updated = await response.json();
          onUpdate(updated);
          onClose();
        } else {
          alert("Error al actualizar en el servidor.");
        }
      } catch (error) {
        alert("Error de conexión con el backend.");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-sabana-blue/60 backdrop-blur-sm" onClick={onClose}></div>
        <form onSubmit={handleSubmit} className="relative bg-default-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-black text-sabana-blue mb-6 border-b pb-4">Editar Producto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-sabana-blue uppercase">Nombre del producto</label>
              <input 
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${fieldErrors.title ? 'border-error-red' : 'border-gray-100'}`} 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
              
              <label className="block text-[11px] font-bold text-sabana-blue uppercase">URL Imagen</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 outline-none" 
                value={formData.imageUrl || ''} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase">Precio</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase">Stock</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <label className="block text-[11px] font-bold text-sabana-blue uppercase">Categoría</label>
              <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-100" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-500 font-bold uppercase hover:bg-gray-50 rounded-xl transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-sabana-blue text-white rounded-xl font-bold uppercase shadow-lg hover:bg-sabana-blue-hover disabled:opacity-50">
              {isSaving ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sabana-light flex flex-col antialiased">
      {/* NAVBAR */}
      <header className="bg-sabana-blue sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <img src={smallLogo} alt="Logo" className="h-8 w-auto cursor-pointer" onClick={() => navigate('/')} />
          <span className="hidden md:block text-white font-bold text-lg">Mi Inventario</span>
        </div>
        
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('/')} className="text-white/80 hover:text-white flex items-center gap-2 text-xs font-bold uppercase">
            <ArrowLeft size={18} /> Inicio
          </button>
          <div className="w-10 h-10 rounded-xl bg-sabana-softGold/20 flex items-center justify-center border border-white/30">
            <User className="text-white w-6 h-6" />
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-sabana-blue tracking-tight">Tus productos</h1>
            <p className="text-gray-500">Administra tus publicaciones activas en el Marketplace.</p>
          </div>
          <button 
            onClick={() => navigate('/create-product')} 
            className="flex items-center gap-2 bg-sabana-blue text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 animate-pulse text-sabana-blue font-bold">Cargando tu inventario...</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No tienes productos aún. ¡Anímate a vender algo!</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="group flex flex-col md:flex-row items-center bg-white p-6 rounded-3xl shadow-sm border border-transparent hover:border-sabana-softGold/50 transition-all">
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative">
                    <img 
                      src={product.imageUrl || smallLogo} 
                      className="w-24 h-24 object-cover rounded-2xl border border-gray-100" 
                      alt="Producto"
                      onError={(e) => { e.target.src = smallLogo; }}
                    />
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      <button onClick={() => setEditingProduct(product)} className="bg-sabana-blue text-white p-2 rounded-lg hover:bg-sabana-softGold hover:text-sabana-blue transition-colors shadow-md">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-md">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-sabana-blue">{product.title}</h3>
                    <span className="text-[10px] font-black bg-sabana-light text-sabana-blue px-2 py-1 rounded uppercase">{product.category}</span>
                  </div>
                </div>
                
                <div className="flex gap-10 mt-6 md:mt-0 items-center">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Precio</p>
                    <p className="font-bold text-gray-700">${product.price?.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Stock</p>
                    <p className="bg-sabana-light text-sabana-blue px-3 py-1 rounded-lg font-bold">{product.stock}</p>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                    <p className="text-2xl font-black text-sabana-blue">${(product.price * product.stock).toLocaleString('es-CO')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL CONDICIONAL */}
      {editingProduct && (
        <EditModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onUpdate={handleUpdateProduct} 
        />
      )}
    </div>
  );
};

export default PersonalInventory;