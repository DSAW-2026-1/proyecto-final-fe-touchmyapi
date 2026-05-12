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
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [hostMessage, setHostMessage] = useState('');
  
    if (!product) return null;
  
    const validateForm = () => {
      const newErrors = {};
      const MAX_PRICE = 1_000_000_000_000;
      
      // Validaciones de texto y selección
      if (!formData.title.trim()) newErrors.title = 'El nombre es obligatorio';
      if (!formData.category) newErrors.category = 'Selecciona una categoría';
      if (!formData.condition) newErrors.condition = 'Selecciona el estado';
  
      // Validación de Precio
      const numericPrice = Number(formData.price);
      if (formData.price === '' || Number.isNaN(numericPrice) || numericPrice <= 0 || numericPrice > MAX_PRICE) {
        newErrors.price = 'Indica un precio válido';
      }
  
      // Validación de Stock (Mínimo 1)
      const numericStock = Number(formData.stock);
      if (formData.stock === '' || Number.isNaN(numericStock) || numericStock < 1) {
        newErrors.stock = 'El stock debe ser al menos 1';
      }
  
      // Validación de Descripción
      if (!formData.description.trim() || formData.description.trim().length < 3) {
        newErrors.description = 'La descripción es muy corta';
      }
  
      // validación de imagen
      const urlTrim = (formData.imageUrl || '').trim();
      if (urlTrim) {
        try {
          const u = new URL(urlTrim);
          if (!['http:', 'https:'].includes(u.protocol)) {
            newErrors.imageUrl = 'La URL debe iniciar con http o https';
          }
        } catch {
          newErrors.imageUrl = 'Introduce una URL de imagen válida';
        }
      }
  
      setFieldErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const hasChanges = () => {
      return (
        formData.title !== product.title ||
        Number(formData.price) !== Number(product.price) ||
        Number(formData.stock) !== Number(product.stock) ||
        formData.category !== product.category ||
        formData.description !== product.description ||
        formData.imageUrl !== product.imageUrl ||
        formData.condition !== product.condition 
        
      );
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setHostMessage('');
  
      if (!validateForm()) return;
  
      if (!hasChanges()) {
        setHostMessage('No hay cambios nuevos para sincronizar.');
        setTimeout(() => setHostMessage(''), 3000);
        return;
      }
  
      setLoading(true);
      try {
        const payload = {
          ...formData,
          title: formData.title.trim(),
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category.trim(),
          description: formData.description.trim(),
          imageUrl: (formData.imageUrl || '').trim(),
          condition: formData.condition.trim()
        };
  
        const response = await fetch(`${apiUrl}/api/v1/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          const updatedProduct = await response.json();
          onUpdate(updatedProduct); 
          onClose();
          alert("Producto actualizado correctamente.");
        }
      } catch (error) {
        alert("Error al conectar con el backend.");
      } finally {
        setLoading(false);
      }
    };
  
    const getInputClass = (fieldName) => `
      w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium
      ${fieldErrors[fieldName] 
        ? 'border-error-red bg-error-bg-red focus:border-error-red' 
        : 'border-defaultBorder-gray bg-default-white focus:border-sabana-softGold'}
    `;
  
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-sabana-blue/60 backdrop-blur-sm" onClick={onClose}></div>
        
        <form onSubmit={handleSubmit} className="relative bg-default-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl my-8">
          {hostMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] z-[110]">
              <p className="bg-sabana-softGold text-sabana-blue text-xs font-black p-3 rounded-2xl text-center shadow-lg border border-sabana-blue/10">
                {hostMessage}
              </p>
            </div>
          )}
  
          <h2 className="text-2xl font-black text-sabana-blue mb-6 border-b pb-4">Editar Detalles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Nombre</label>
                <input className={getInputClass('title')} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                {fieldErrors.title && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.title}</p>}
              </div>
  
              {/* CAMPO DE IMAGEN */}
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">URL de Imagen (Opcional)</label>
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/foto.jpg"
                  className={getInputClass('imageUrl')} 
                  value={formData.imageUrl || ''} 
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                />
                {fieldErrors.imageUrl && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.imageUrl}</p>}
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Categoría</label>
                <select className={getInputClass('category')} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
  
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Precio</label>
                  <input type="number" className={getInputClass('price')} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  {fieldErrors.price && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Stock</label>
                  <input type="number" className={getInputClass('stock')} value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                  {fieldErrors.stock && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.stock}</p>}
                </div>
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Estado</label>
                <select className={getInputClass('condition')} value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                  <option value="NEW">Nuevo</option>
                  <option value="USED">Usado</option>
                </select>
              </div>
  
              <div>
                <label className="block text-[11px] font-bold text-sabana-blue uppercase ml-1 mb-1">Descripción</label>
                <textarea rows="3" className={`${getInputClass('description')} resize-none`} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                {fieldErrors.description && <p className="mt-1 ml-1 text-[10px] text-error-red font-bold uppercase">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>
  
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-default-gray font-black uppercase tracking-widest hover:bg-sabana-light rounded-xl transition-all">Descartar</button>
            <button type="submit" disabled={loading} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all ${!hasChanges() ? 'bg-gray-200 text-gray-400' : 'bg-sabana-blue text-white hover:bg-sabana-blue-hover'}`}>
              {loading ? 'Sincronizando...' : 'Guardar'}
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
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-2xl shadow-inner border border-defaultBorder-gray"
                    onError={(e) => { e.target.src = smallLogo; }}
                  />
                    <button 
                      onClick={() => setEditingProduct(product)} // <--- Ahora guarda el producto para editarlo
                      className="absolute -top-2 -left-2 bg-sabana-blue text-white p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sabana-softGold hover:text-sabana-blue"
                      title="Editar publicación"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="absolute -top-2 -right-2 bg-error-bg-red text-error-red p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-red hover:text-white"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
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