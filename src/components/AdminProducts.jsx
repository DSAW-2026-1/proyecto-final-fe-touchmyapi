import React, { useState, useEffect } from 'react';
import { Trash2, Edit, RefreshCw, Package, User, Hash } from 'lucide-react';

const CATEGORIES = [
  { value: 'ACADEMIC_SUPPLIES', label: 'Útiles académicos' },
  { value: 'BOOKS', label: 'Libros' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'CLOTHING', label: 'Ropa' },
  { value: 'FOOD', label: 'Comida' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'OTHER', label: 'Otros' },
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿De verdad quiere borrar esta publicación?")) {
      try {
        const response = await fetch(`${apiUrl}/api/v1/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(p => p.id !== id));
        }
      } catch (error) {
        alert("No se pudo borrar el producto");
      }
    }
  };

  const handleUpdateLocal = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <RefreshCw className="animate-spin text-sabana-blue" size={32} />
      <p className="text-gray-500 font-medium">Sincronizando inventario...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-4 font-bold text-sabana-blue text-[10px] uppercase tracking-wider">Publicación</th>
            <th className="p-4 font-bold text-sabana-blue text-[10px] uppercase tracking-wider text-center">Dueño</th>
            <th className="p-4 font-bold text-sabana-blue text-[10px] uppercase tracking-wider text-center">Stock</th>
            <th className="p-4 font-bold text-sabana-blue text-[10px] uppercase tracking-wider text-center">Precio</th>
            <th className="p-4 font-bold text-sabana-blue text-[10px] uppercase tracking-wider text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-tight">{product.title}</p>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase mt-1 inline-block">
                      {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <User size={14} className="text-gray-400 mb-1" />
                  <p className="text-xs text-gray-600 font-medium">{product.ownerEmail || 'Anónimo'}</p>
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Hash size={12} className="text-gray-500" />
                  <span className="text-sm font-bold text-gray-700">{product.stock}</span>
                </div>
              </td>
              <td className="p-4 text-center font-black text-sabana-blue">
                ${product.price?.toLocaleString()}
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <EditModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onUpdate={handleUpdateLocal}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTE MODAL CON VALIDACIONES COMPLETAS ---
const EditModal = ({ product, onClose, onUpdate, apiUrl }) => {
  const [formData, setFormData] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hostMessage, setHostMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const MAX_PRICE = 1_000_000_000;
    
    if (!formData.title?.trim()) newErrors.title = 'El nombre es obligatorio';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.condition) newErrors.condition = 'Selecciona el estado';

    const numericPrice = Number(formData.price);
    if (formData.price === '' || isNaN(numericPrice) || numericPrice <= 0 || numericPrice > MAX_PRICE) {
      newErrors.price = 'Precio inválido (1 - 1MM)';
    }

    const numericStock = Number(formData.stock);
    if (formData.stock === '' || isNaN(numericStock) || numericStock < 1) {
      newErrors.stock = 'Mínimo 1 unidad';
    }

    if (!formData.description?.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'Descripción demasiado corta';
    }

    const urlTrim = (formData.imageUrl || '').trim();
    if (urlTrim) {
      try {
        const u = new URL(urlTrim);
        if (!['http:', 'https:'].includes(u.protocol)) {
          newErrors.imageUrl = 'Debe empezar con http/https';
        }
      } catch {
        newErrors.imageUrl = 'URL de imagen no válida';
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
    if (!validateForm()) return;
    if (!hasChanges()) {
      setHostMessage('No has realizado ningún cambio.');
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
        description: formData.description.trim(),
        imageUrl: (formData.imageUrl || '').trim()
      };

      const response = await fetch(`${apiUrl}/api/v1/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
        onClose();
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => `
    w-full px-4 py-2 rounded-xl border-2 transition-all outline-none text-sm font-medium
    ${fieldErrors[fieldName] ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-sabana-softGold'}
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-sabana-blue/60 backdrop-blur-sm" onClick={onClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-xl rounded-[32px] p-8 shadow-2xl my-auto">
        {hostMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4">
            <p className="bg-sabana-softGold text-sabana-blue text-[10px] font-black p-2 rounded-xl text-center shadow-lg border border-sabana-blue/10">
              {hostMessage}
            </p>
          </div>
        )}
        
        <h2 className="text-2xl font-black text-sabana-blue mb-6">Ficha Técnica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Título del Producto</label>
              <input className={getInputClass('title')} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              {fieldErrors.title && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">URL Imagen</label>
              <input className={getInputClass('imageUrl')} value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              {fieldErrors.imageUrl && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.imageUrl}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Categoría</label>
              <select className={getInputClass('category')} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Precio ($)</label>
                <input type="number" className={getInputClass('price')} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                {fieldErrors.price && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.price}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Stock</label>
                <input type="number" className={getInputClass('stock')} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                {fieldErrors.stock && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Estado</label>
              <select className={getInputClass('condition')} value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                <option value="NEW">Nuevo</option>
                <option value="USED">Usado</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-sabana-blue/50 uppercase ml-1">Descripción</label>
              <textarea rows="2" className={`${getInputClass('description')} resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              {fieldErrors.description && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">{fieldErrors.description}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Descartar</button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-sabana-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-sabana-blue-hover transition-all disabled:opacity-50">
            {loading ? 'Sincronizando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProducts;